resource "aws_iam_policy" "server_lambda_additional_policy" {
  name   = "${var.prefix}-server-lambda-additional-policy"
  policy = templatefile("${path.module}/iam_policies/server-lambda-iam-policy.json", {})
}

resource "aws_iam_policy" "content_cache_hydrator_lambda_additional_policy" {
  name   = "${var.prefix}-content-cache-hydrator-lambda-additional-policy"
  policy = templatefile("${path.module}/iam_policies/cache-lambda-iam-role-policy.json", {})
}
