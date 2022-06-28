# Cleanup distributions from Bloomreach(BR) Cloud action
This action cleans up/deletes the `distributionsDeleteCount` number of oldest distributions when Bloomreach(BR) Cloud hits maximum number of distributions as indicated by `maxDistributions`.

The action is using the BR Cloud Rest API. The API documentation is available at `https://api.<stack-name>.bloomreach.cloud/v3/docs`.

## Inputs

### `brcStack`

**Required** BR Cloud stack name.

### `username`

**Required** BR Cloud username.

### `password`

**Required** BR Cloud password.

### `maxDistributions`

_optional_ Maximum number of distributions in Bloomreach(BR) Cloud at which oldest distributions needs to be deleted. Defaults to `100`.

### `distributionsDeleteCount`

_optional_ Count/Number of oldest distributions that needs to be deleted when brCloud hits `maxDistributions`. Defaults to `1`.

## Outputs
This action adds no outputs.

## Example usage

```
uses: Health-Education-England/cleanup-distributions-from-BR-Cloud-action@v1.0
with:
  brcStack: "brStackName"
  username: ${{ secrets.BRC_USERNAME }}
  password: ${{ secrets.BRC_PASSWORD }}
  [maxDistributions: "80"]
  [distributionsDeleteCount: "10"]
```
