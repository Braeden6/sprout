/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GameState } from '../models/GameState';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Init Game
     * @returns GameState Successful Response
     * @throws ApiError
     */
    public static initGameGamesFaceInitGet(): CancelablePromise<GameState> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/games/face/init',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Chat History
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getChatHistoryChatHistoryGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/chat/history',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Clear Chat History
     * @returns any Successful Response
     * @throws ApiError
     */
    public static clearChatHistoryChatClearDelete(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/chat/clear',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Root
     * @param question
     * @returns any Successful Response
     * @throws ApiError
     */
    public static rootGet(
        question: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
            query: {
                'question': question,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
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
     * @returns User Successful Response
     * @throws ApiError
     */
    public static getCurrentUserInfoAuthMeGet(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
