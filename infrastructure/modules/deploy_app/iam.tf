resource "aws_iam_policy" "server_lambda_additional_policy" {
  name   = "${var.prefix}-server-lambda-additional-policy"
  policy = templatefile("${path.module}/iam_policies/server-lambda-iam-policy.json", {})
}

resource "aws_iam_policy" "cache_lambda_additional_policy" {
  name   = "${var.prefix}-cache-lambda-additional-policy"
  policy = templatefile("${path.module}/iam_policies/cache-lambda-iam-role-policy.json", {})
}
