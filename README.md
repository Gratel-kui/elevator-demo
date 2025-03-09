# elevator-demo

Timezone API service based on geographic location.

## Features

- Get the start time of each month (ISO 8601 UTC format) based on longitude, latitude, and time range

## Installation

```
make install
```

## Running

```
make run
```

The service will start on port 3000.

## API Documentation

### Get Month Start Times

```
GET /months?lon={lon}&lat={lat}&from={from}&to={to}
```

#### Parameters

- `lon`: Longitude of the query location
- `lat`: Latitude of the query location
- `from`: Start month of the time period, format YYYY-MM
- `to`: End month of the time period, format YYYY-MM

#### Response

```json
{
  "monthStarts": [
    "2024-01-31T16:00:00.000Z",
    "2024-02-29T16:00:00.000Z",
    ...
  ]
}
```

## Next Steps

This is a basic implementation, but there are some areas for improvement:

1. **More accurate timezone calculation**: The current implementation uses a simplified method for timezone calculation. In a real application, you should use a more accurate library for mapping geographic location to timezone, such as `geotz` or `tzdb`.

2. **Input validation**: Add stricter input validation and error handling.

3. **Testing**: Add unit tests and integration tests.

4. **Documentation**: Use Swagger or a similar tool to generate API documentation.

5. **Logging**: Add structured logging.

6. **Docker support**: Add Dockerfile and docker-compose.yml for containerized deployment.

You can implement these improvements step by step as needed. Now, you have a basic working version that you can install with `make install` and start with `make run`.