resource "aws_iam_role" "cache_lambda_iam_role" {
  name               = "${var.prefix}-cache-lambda-iam-role"
  assume_role_policy = templatefile("${path.module}/policies/cache-lambda-iam-role.json", {})
}

resource "aws_iam_policy" "cache_lambda_iam_role_policy" {
  name   = "${var.prefix}-cache-lambda-iam-role-policy"
  policy = templatefile("${path.module}/policies/cache-lambda-iam-role-policy.json", {})
}

resource "aws_iam_role_policy_attachment" "example-attach" {
  role       = aws_iam_role.cache_lambda_iam_role.name
  policy_arn = aws_iam_policy.cache_lambda_iam_role_policy.arn
}
