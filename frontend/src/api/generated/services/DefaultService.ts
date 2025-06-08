/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GameState } from '../models/GameState';
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCurrentUserInfoAuthMeGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
        });
    }
}
