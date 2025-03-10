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

### GET formatted-months
 
```
GET /formatted-months?lon={lon}&lat={lat}&from={from}&to={to}&dateFormat={dateFormat}
```

#### Additional Parameters

- `dateFormat`: Format for the returned dates (required)

#### Supported Date Formats

- `ISO`: ISO 8601 format (e.g., "2024-01-31T15:59:59.000Z")
- `YYYY-MM-DD`: Year-month-day (e.g., "2024-01-31")
- `DD-MM-YYYY`: Day-month-year (e.g., "31-01-2024")
- `MM-DD-YYYY`: Month-day-year (e.g., "01-31-2024")
- `YYYY/MM/DD`, `DD/MM/YYYY`, `MM/DD/YYYY`: Same formats with slashes
- `YYYY-MM-DD HH:mm:ss`: Date and time (e.g., "2024-01-31 15:59:59")
- `%Y-%m-%d`, `%d/%m/%Y`, etc.: strftime-style formats

#### Example Request
```
http://localhost:3000/formatted-months?lon=121.47&lat=31.23&from=2024-01&to=2024-03&dateFormat=YYYY-MM-DD
```

#### Example Response

```json
{
  "monthStarts": [
    "2024-01-31",
    "2024-02-29",
    "2024-03-31"
  ],
  "metadata": {
    "timezone": "Asia/Shanghai",
    "format": "YYYY-MM-DD"
  }
}
```