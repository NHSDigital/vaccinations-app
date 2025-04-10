resource "aws_iam_role" "lambda_role" {
  name = "${var.prefix}-content-cache-hydrator-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_additional_policy" {
  name   = "${var.prefix}-content-cache-hydrator-lambda-additional-policy"
  policy = templatefile("${path.module}/iam-policy.json", {})
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_additional_policy.arn
}
