/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * New Auth
     * @returns any Successful Response
     * @throws ApiError
     */
    public static newAuthAuthNewGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/new',
        });
    }
    /**
     * Get Current User Info
     * @param authorization
     * @returns User Successful Response
     * @throws ApiError
     */
    public static getCurrentUserInfoAuthMeGet(
        authorization?: (string | null),
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
            headers: {
                'authorization': authorization,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
