import {BrOperations} from "./BrOperations";
import * as core from '@actions/core';
import {ApiClient} from "./ApiClient";

function initBrOperations(brcStack: string) {
    const config = {
        baseURL: `https://api.${brcStack}.bloomreach.cloud`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        timeout: 1000 * 120,
        timeoutErrorMessage: "Timeout Error! The time limit of 2 minutes was exceeded."
    }

    const apiClient = new ApiClient(config)
    return new BrOperations(apiClient)
}

async function cleanupDistributionsWhenBRCloudHitsMaxDistributions() {
    try {
        const brcStack = core.getInput('brcStack', {required: true});
        const username = core.getInput('username', {required: true});
        const password = core.getInput('password', {required: true});
        const maxDistributions = Number(core.getInput('maxDistributions'));
        const distributionsDeleteCount = Number(core.getInput('distributionsDeleteCount'));

        if (isNaN(maxDistributions) || isNaN(distributionsDeleteCount)) {
            throw new Error('Input \'maxDistributions\' and/or \'distributionsDeleteCount\' is/are NOT a number!');
        }

        const brOperations = initBrOperations(brcStack);

        core.info('Start login process');
        const accessToken = await brOperations.login(username, password);
        core.info('Login process finished with success');

        core.info('Start getting [current] distribution list from Bloomreach(BR) Cloud');
        let distributionList = await brOperations.getDistributionList(accessToken);
        core.info('Finished getting [current] distribution list from Bloomreach(BR) Cloud');

        core.info(`Count of distributions at Bloomreach(BR) Cloud = ${distributionList.count}`);

        if (distributionList.count === 0) {
            core.info('There are no distributions exists in Bloomreach(BR) Cloud');
            return;
        }

        if (distributionList.count >= maxDistributions) {
            core.info(`Bloomreach(BR) Cloud hit/exceeded the limit (${maxDistributions}) of maximum number of distributions`);
            core.info(`An attempt will be made to remove ${distributionsDeleteCount} oldest distributions from Bloomreach(BR) Cloud in order to create room to upload future distributions`);

            // Sort the distributions by distribution creation date (`createdAt`)
            const sortedDistributionItems = distributionList.items.sort((a: Distribution, b: Distribution) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

            // Get ${distributionsDeleteCount} number of oldest distributions
            const oldestDistributionsToBeDeleted = sortedDistributionItems.slice((sortedDistributionItems.length - distributionsDeleteCount), sortedDistributionItems.length);

            // Builds an array of oldest distribution ids
            const oldestDistributionIdsToBeDeleted = oldestDistributionsToBeDeleted.map((distribution: Distribution) => distribution.id);

            core.info('Start deleting oldest distributions from Bloomreach(BR) Cloud');
            await brOperations.deleteDistributions(oldestDistributionIdsToBeDeleted, accessToken)
            core.info('Finished deleting oldest distributions from Bloomreach(BR) Cloud');
        } else {
            core.info(`Bloomreach(BR) Cloud haven't hit/exceeded the limit (${maxDistributions}) of maximum number of distributions yet. No actions taken.`);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

cleanupDistributionsWhenBRCloudHitsMaxDistributions()
    .then(() =>  core.info("Finished action"))
    .catch((error) => {
        core.setFailed(error.message);
    })