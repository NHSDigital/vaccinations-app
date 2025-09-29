resource "aws_appautoscaling_target" "lambda_provisioned_scaling_target" {
  max_capacity       = 400
  min_capacity       = 1
  resource_id        = "function:${var.prefix}-server-function:nextjs"
  scalable_dimension = "lambda:function:ProvisionedConcurrency"
  service_namespace  = "lambda"
}

resource "aws_appautoscaling_policy" "lambda_provisioned_scaling_policy" {
  name               = "${var.prefix}-lambda-auto-scaling-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.lambda_provisioned_scaling_target.resource_id
  scalable_dimension = aws_appautoscaling_target.lambda_provisioned_scaling_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.lambda_provisioned_scaling_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "LambdaProvisionedConcurrencyUtilization"
    }

    target_value = 0.7
  }
}
