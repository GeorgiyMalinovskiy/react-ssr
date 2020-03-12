import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { getResourceList } from 'store/state/resources/selectors';
import { RouteComponentProps } from 'router/utils';
import { useRequest } from 'store/state/network/hooks';

const Users: FC<RouteComponentProps> = (props) => {
  console.log(props);
  // const { isLoading, error } = useRequest({ removeOnUnmount: true });
  const userList = useSelector(getResourceList('users'));
  return (
    <>
      User list:
      {
        (userList || []).map(({ id, name }) => (
          <p key={`user-list-item-${id}`}>
            <strong>{id}:</strong>&nbsp;
            {name}
          </p>
        ))
      }
    </>
  );
};

export default Users;
