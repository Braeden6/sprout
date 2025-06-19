/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_finish_game_games_face__session_id__finish_post } from '../models/Body_finish_game_games_face__session_id__finish_post';
import type { Body_get_help_games_face__session_id__help_post } from '../models/Body_get_help_games_face__session_id__help_post';
import type { GameState } from '../models/GameState';
import type { HelpResponse } from '../models/HelpResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GamesFaceService {
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
     * Match Emotion
     * @param sessionId
     * @param emotion
     * @param isCorrect
     * @param authorization
     * @returns any Successful Response
     * @throws ApiError
     */
    public static matchEmotionGamesFaceSessionIdMatchPost(
        sessionId: string,
        emotion: string,
        isCorrect: boolean,
        authorization?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/games/face/{session_id}/match',
            path: {
                'session_id': sessionId,
            },
            headers: {
                'authorization': authorization,
            },
            query: {
                'emotion': emotion,
                'is_correct': isCorrect,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Finish Game
     * @param sessionId
     * @param formData
     * @param authorization
     * @returns HelpResponse Successful Response
     * @throws ApiError
     */
    public static finishGameGamesFaceSessionIdFinishPost(
        sessionId: string,
        formData: Body_finish_game_games_face__session_id__finish_post,
        authorization?: (string | null),
    ): CancelablePromise<HelpResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/games/face/{session_id}/finish',
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
}
