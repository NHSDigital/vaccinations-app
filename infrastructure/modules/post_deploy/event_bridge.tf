resource "aws_cloudwatch_event_rule" "warmer_lambda_deployment_event_rule" {
  name        = "${var.prefix}-post-deployment-event-rule"
  description = "Triggers Warmer Lambda on deployment"
  tags        = var.default_tags
  event_pattern = jsonencode({
    "source" : ["aws.lambda"],
    "detail-type" : ["AWS API Call via CloudTrail"],
    "detail" : {
      "eventSource" : ["lambda.amazonaws.com"],
      "eventName" : ["CreateFunction20150331", "UpdateFunctionCode20150331v2", "UpdateFunctionConfiguration20150331v2"],
      "requestParameters" : {
        "functionName" : [local.warmer_function_name]
      }
    }
  })
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  target_id = "lambda"
  rule      = aws_cloudwatch_event_rule.warmer_lambda_deployment_event_rule.name
  arn       = local.warmer_function_arn
}

resource "aws_lambda_permission" "allow_event_bridge_to_invoke_lambda" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = local.warmer_function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.warmer_lambda_deployment_event_rule.arn
}
