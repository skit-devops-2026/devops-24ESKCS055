# Monitoring Setup for Sayso

This directory contains the metrics and observability configuration for Sayso.

## Architecture

- **Metrics Source:** Node.js Express backend exposed at `GET /metrics` in Prometheus text exposition format (version 0.0.4).
- **Scraper:** Prometheus server configured via `prometheus.yml` scraping the backend target every 5 seconds.
- **Visualizer:** Grafana dashboard defined in `dashboard.json`.

## Exposed Metrics

- `http_requests_total`: Cumulative counter of all incoming HTTP requests.
- `process_uptime_seconds`: Process uptime in seconds.
- `nodejs_heap_size_used_bytes`: V8 heap memory consumed by the application.
- `nodejs_resident_memory_bytes`: RSS memory consumed by the node process.
