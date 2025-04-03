resource "aws_iam_policy" "server_lambda_additional_policy" {
  name   = "${var.prefix}-server-lambda-additional-policy"
  policy = templatefile("${path.module}/iam-policy.json", {})
}
