resource "aws_iam_policy" "server_lambda_additional_policy" {
  name   = "${var.prefix}-server-lambda-additional-policy"
  policy = templatefile("${path.module}/policies/server-lambda-iam-policy.json", {})
}
