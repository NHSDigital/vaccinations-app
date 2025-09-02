resource "aws_cloudwatch_event_rule" "cache_hydrator_lambda_deployment_event_rule" {
  name        = "${var.prefix}-post-deployment-event-rule"
  description = "Triggers content cache hydrator on deployments"
  tags        = var.default_tags
  event_pattern = jsonencode({
    "source" : ["aws.lambda"],
    "detail-type" : ["AWS API Call via CloudTrail"],
    "detail" : {
      "eventSource" : ["lambda.amazonaws.com"],
      "eventName" : ["CreateFunction20150331", "UpdateFunctionCode20150331v2"],
      "requestParameters" : {
        "functionName" : [module.content_cache_hydrator_lambda_function.lambda_function_name]
      }
    }
  })
}

resource "aws_cloudwatch_event_rule" "cache_hydrator_lambda_schedule_event_rule" {
  name                = "${var.prefix}-on-schedule-event-rule"
  description         = "Triggers content cache hydrator on schedule"
  tags                = var.default_tags
  schedule_expression = "cron(0 9 * * ? *)"
}

resource "aws_cloudwatch_event_target" "on_deployment_target" {
  target_id = "on-deployment"
  rule      = aws_cloudwatch_event_rule.cache_hydrator_lambda_deployment_event_rule.name
  arn       = module.content_cache_hydrator_lambda_function.lambda_function_arn
}

resource "aws_cloudwatch_event_target" "on_schedule_target" {
  target_id = "on-schedule"
  rule      = aws_cloudwatch_event_rule.cache_hydrator_lambda_schedule_event_rule.name
  arn       = module.content_cache_hydrator_lambda_function.lambda_function_arn
}

resource "aws_lambda_permission" "allow_event_bridge_to_invoke_lambda" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = module.content_cache_hydrator_lambda_function.lambda_function_name
  principal     = "events.amazonaws.com"
  source_arn    = module.content_cache_hydrator_lambda_function.lambda_function_arn
}
