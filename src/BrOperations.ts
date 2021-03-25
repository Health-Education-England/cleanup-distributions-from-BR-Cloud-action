import {ApiClient} from "./ApiClient";

export class BrOperations {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient
    }

    async login(username: string, password: string) {
        console.log('Retrieve BRC access token.');
        const authURL = '/v3/authn/access_token';

        const response = await this.apiClient.post(
            authURL,
            {
                username,
                password,
            },
        );
        console.log('Received access token');

        const authResponse = response.data;
        return `Bearer ${authResponse.access_token}`
    }

    async getDistributionList(accessToken: string): Promise<DistributionList> {
        console.log('Get [Current] Distribution List from Bloomreach(BR) Cloud');

        const response = await this.apiClient.get(
            '/v3/distributions',
            {
                headers: {
                    Authorization: accessToken,
                }
            },
        );

        console.log('Received [Current] Distribution List from Bloomreach(BR) Cloud');

        return response.data;
    }

    async deleteDistributions(oldestDistributionIdsToBeDeleted: Array<string>, accessToken: string) {
        console.log(`Attempting to delete distributions with ids [${oldestDistributionIdsToBeDeleted}] from Bloomreach(BR) Cloud`);

        for (const distributionId of oldestDistributionIdsToBeDeleted) {
            await this.apiClient.delete(
                '/v3/distributions/' + distributionId,
                {
                    headers: {
                        Authorization: accessToken,
                    }
                },
            );

            console.log(`Distribution with Id '${distributionId}' has successfully been deleted from Bloomreach(BR) Cloud`);
        }
    }
}