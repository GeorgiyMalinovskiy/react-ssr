/* eslint-disable no-console */

import ejs from 'ejs';
import nodePath from 'path';
import express, { Request, Response } from 'express';
import serialize from 'serialize-javascript';
import jsonServer from 'json-server';
import { ServerStyleSheets } from '@material-ui/core/styles';

import { createElement, FC } from 'react';
import { Dispatch } from 'redux';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import { StaticContext, StaticRouter } from 'react-router';
import { matchRoutes } from 'react-router-config';

import routes from 'router/routes.json';

import createStore from 'store';
import { setRequestSuccess, setRequestFailure } from 'store/state/network';
import { fetchAPI } from 'store/state/network/utils';

import { Root as RootType } from '-web/utils';

import mockDbJSON from './mock_db.json';

const {
  NODE_ENV,
  APP_PATHS: PATHS = '{}',
  APP_HOST,
  APP_PORT,
  API_HOST,
  API_PORT,
} = process.env;
const APP_PATHS = JSON.parse(PATHS!);
const IS_PROD = NODE_ENV === 'production';

(async (): Promise<void> => {
  if (IS_PROD) {
    const expressApp = express();
    expressApp.use(
      '/',
      express.static(nodePath.join(APP_PATHS.distPublic, 'web'), { index: false }),
    );

    const loadBranchData = (url: string, dispatch: Dispatch): Promise<unknown> => {
      const branch = matchRoutes(routes, url);

      const promises: Promise<unknown>[] = branch.reduce((
        acc,
        { route: { resourceName }, match: payload },
      ) => {
        if (resourceName) {
          return [
            ...acc,
            fetchAPI(payload)
              .then((result) => {
                dispatch(setRequestSuccess(payload, result));
              })
              .catch((error) => {
                dispatch(setRequestFailure(
                  { ...payload, statusText: error.message },
                ));
              }),
          ];
        }

        return acc;
      }, []);

      return Promise.all(promises);
    };

    const nodeStats = nodePath.resolve(APP_PATHS.distPublic, 'node', 'loadable-stats.json');
    const webStats = nodePath.resolve(APP_PATHS.distPublic, 'web', 'loadable-stats.json');

    const handleRender = async (req: Request, res: Response): Promise<void> => {
      const context: { url?: string } & StaticContext = {};

      if (context.url) {
        res
          .writeHead(context.statusCode || 301, { location: context.url })
          .end();
      } else {
        const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
        const { default: Root } = nodeExtractor.requireEntrypoint();

        const store = createStore();
        await loadBranchData(req.url, store.dispatch);
        const preloadedState = store.getState();

        const sheets = new ServerStyleSheets();
        const RootElement = sheets.collect(
          createElement(
              Root as FC<RootType>,
              {
                store,
                Router: StaticRouter,
              },
          ),
        );

        const webExtractor = new ChunkExtractor({ statsFile: webStats });
        const jsx = webExtractor.collectChunks(RootElement);

        const html = await ejs.renderFile(
          APP_PATHS.html.entry,
          {
            linkTags: webExtractor.getLinkTags(),
            root: renderToString(jsx),
            scriptTags: webExtractor.getScriptTags(),
            apiConfig: serialize({ API_HOST, API_PORT }),
            preloadedState: serialize(preloadedState),
          },
          {
            rmWhitespace: true,
            client: true,
          },
        );

        res
          .writeHead(context.statusCode || 200, { 'Content-type': 'text/html' })
          .end(html);
      }
    };

    expressApp.get('*', handleRender);

    const [path, port] = [APP_HOST!, APP_PORT!];
    expressApp
      .listen({ path, port }, (() => {
        console.log(`Express listening on ${path}:${port}`);
      }))
      .on('error', (error) => {
        console.error('Express error: ', error);
        process.exit(1);
      });
  }

  const jsonApp = jsonServer.create();

  const router = jsonServer.router(mockDbJSON);
  const middlewares = jsonServer.defaults();

  jsonApp.use(middlewares);
  jsonApp.use('/api', router);

  const [path, port] = [API_HOST!, API_PORT!];
  jsonApp
    .listen({ path, port }, () => {
      console.log(`JSON Server is running on ${path}:${port}`);
    })
    .on('error', (error) => {
      console.error('JSON Server database error: ', error);
      process.exit(1);
    });
})();
