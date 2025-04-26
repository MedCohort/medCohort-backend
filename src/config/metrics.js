const client = require('prom-client')

const register = new client.Registry()
register.setDefaultLabels({
    app: 'medcohort-backend'
  });

  const httpRequestCounter  = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
  })

  register.registerMetric(httpRequestCounter)

  const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5],
})

register.registerMetric(httpRequestDuration)

const metricsMiddleware = (req,res, next) => {
    const start = Date.now()

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        httpRequestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        })
        httpRequestDuration.observe({
            method: req.method,
            route: req.route? req.route.path : req.path,
            status_code: res.statusCode
        }, duration)
    })
    next()
}

module.exports = {
    metricsMiddleware,
    register
}