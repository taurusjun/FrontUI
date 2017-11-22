import { stringify } from 'qs';
import request from '../utils/request';

export async function queryController(params) {
  return request(`/api/controller?${stringify(params)}`);
}

export async function removeController(params) {
  return request('/api/controller', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addController(params) {
  return request('/api/controller', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}
