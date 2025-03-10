# elevator-demo

Timezone API service based on geographic location.

## Features

- Get the start time of each month (ISO 8601 UTC format) based on longitude, latitude, and time range
- Interactive API documentation with Swagger UI
- Input validation and error handling
- Cross-platform support

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

Swagger UI documentation is available at:
```
http://localhost:3000/api-docs
```

### Get Month Start Times

```
GET /months?lon={lon}&lat={lat}&from={from}&to={to}
```

#### Parameters

- `lon`: Longitude of the query location
- `lat`: Latitude of the query location
- `from`: Start month of the time period, format YYYY-MM
- `to`: End month of the time period, format YYYY-MM

#### Example Request

```
http://localhost:3000/months?lon=121.47&lat=31.23&from=2024-01&to=2024-03
```

#### Example Response

```json
{
  "monthStarts": [
    "2024-01-31T16:00:00.000Z",
    "2024-02-29T16:00:00.000Z",
    "2024-03-31T16:00:00.000Z"
  ]
}
```

## Health Check

```
GET /health
```

Returns "OK" if the service is running properly.
