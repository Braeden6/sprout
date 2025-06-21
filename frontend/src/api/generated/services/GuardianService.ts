/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GameReviewData } from '../models/GameReviewData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GuardianService {
    /**
     * Get Games Review
     * @param authorization
     * @returns GameReviewData Successful Response
     * @throws ApiError
     */
    public static getGamesReviewGuardianGamesReviewGet(
        authorization?: (string | null),
    ): CancelablePromise<Array<GameReviewData>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/guardian/games/review',
            headers: {
                'authorization': authorization,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Meta Analysis
     * @param authorization
     * @returns string Successful Response
     * @throws ApiError
     */
    public static generateMetaAnalysisGuardianGamesReviewMetaAnalysisPost(
        authorization?: (string | null),
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/guardian/games/review/meta-analysis',
            headers: {
                'authorization': authorization,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
