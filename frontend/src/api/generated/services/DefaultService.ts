/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_get_help_games_face__session_id__help_post } from '../models/Body_get_help_games_face__session_id__help_post';
import type { GameState } from '../models/GameState';
import type { HelpResponse } from '../models/HelpResponse';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Init Game
     * @param authorization
     * @returns GameState Successful Response
     * @throws ApiError
     */
    public static initGameGamesFaceInitGet(
        authorization?: (string | null),
    ): CancelablePromise<GameState> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/games/face/init',
            headers: {
                'authorization': authorization,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Help
     * @param sessionId
     * @param formData
     * @param authorization
     * @returns HelpResponse Successful Response
     * @throws ApiError
     */
    public static getHelpGamesFaceSessionIdHelpPost(
        sessionId: string,
        formData: Body_get_help_games_face__session_id__help_post,
        authorization?: (string | null),
    ): CancelablePromise<HelpResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/games/face/{session_id}/help',
            path: {
                'session_id': sessionId,
            },
            headers: {
                'authorization': authorization,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
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
