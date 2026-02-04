locals {
  trust_for     = var.is_local ? "developer" : "github"
  global_region = "us-east-1"
}

resource "aws_iam_role" "terraform_iam_role" {
  name = "${var.prefix}-iam-role"
  assume_role_policy = templatefile("${path.module}/policies/trust/${local.trust_for}.json", {
    account_id : var.account_id
    region : var.region
    environment : var.environment
  })
}

resource "aws_iam_policy" "terraform_iam_role_permissions" {
  name = "${var.prefix}-iam-role-policy"
  policy = templatefile("${path.module}/policies/permissions/misc.json", {
    account_id : var.account_id
    prefix : var.prefix
    region : var.region
    global_region : local.global_region
    environment : var.environment
    project_shortcode : var.project_shortcode
  })
}

resource "aws_iam_role_policy_attachment" "github_iam_role_policy_attachment" {
  role       = aws_iam_role.terraform_iam_role.name
  policy_arn = aws_iam_policy.terraform_iam_role_permissions.arn
}

########################
# IAM permissions
########################
resource "aws_iam_policy" "iam_iam_role_permissions" {
  name = "${var.prefix}-iam-iam-role-policy"
  policy = templatefile("${path.module}/policies/permissions/iam.json", {
    account_id : var.account_id
    prefix : var.prefix
  })
}

resource "aws_iam_role_policy_attachment" "iam_iam_role_policy_attachment" {
  role       = aws_iam_role.terraform_iam_role.name
  policy_arn = aws_iam_policy.iam_iam_role_permissions.arn
}

########################
# CloudFront permissions
########################
resource "aws_iam_policy" "cloudfront_iam_role_permissions" {
  name = "${var.prefix}-cloudfront-iam-role-policy"
  policy = templatefile("${path.module}/policies/permissions/cloudfront.json", {
    account_id : var.account_id
    prefix : var.prefix
  })
}

resource "aws_iam_role_policy_attachment" "cloudfront_iam_role_policy_attachment" {
  role       = aws_iam_role.terraform_iam_role.name
  policy_arn = aws_iam_policy.cloudfront_iam_role_permissions.arn
}

########################
# S3 permissions
########################
resource "aws_iam_policy" "s3_iam_role_permissions" {
  name = "${var.prefix}-s3-iam-role-policy"
  policy = templatefile("${path.module}/policies/permissions/s3.json", {
    account_id : var.account_id
    prefix : var.prefix
    environment : var.environment
    project_shortcode : var.project_shortcode
  })
}

resource "aws_iam_role_policy_attachment" "s3_iam_role_policy_attachment" {
  role       = aws_iam_role.terraform_iam_role.name
  policy_arn = aws_iam_policy.s3_iam_role_permissions.arn
}

########################
# Lambda permissions
########################
resource "aws_iam_policy" "lambda_iam_role_permissions" {
  name = "${var.prefix}-lambda-iam-role-policy"
  policy = templatefile("${path.module}/policies/permissions/lambda.json", {
    account_id : var.account_id
    prefix : var.prefix
    region : var.region
  })
}

resource "aws_iam_role_policy_attachment" "lambda_iam_role_policy_attachment" {
  role       = aws_iam_role.terraform_iam_role.name
  policy_arn = aws_iam_policy.lambda_iam_role_permissions.arn
}

########################
# Web Application Firewall (WAF) permissions
########################
resource "aws_iam_policy" "waf_iam_role_permissions" {
  name = "${var.prefix}-waf-iam-role-policy"
  policy = templatefile("${path.module}/policies/permissions/waf.json", {
    account_id : var.account_id
    prefix : var.prefix
  })
}

resource "aws_iam_role_policy_attachment" "waf_iam_role_policy_attachment" {
  role       = aws_iam_role.terraform_iam_role.name
  policy_arn = aws_iam_policy.waf_iam_role_permissions.arn
}

########################
# Fake API permissions
########################
resource "aws_iam_policy" "fake_api_iam_role_permissions" {
  count = var.environment == "test" ? 1 : 0

  name = "${var.prefix}-fake-api-iam-role-policy"
  policy = templatefile("${path.module}/policies/permissions/test/fake-api.json", {
    account_id : var.account_id
    prefix : var.prefix
    region : var.region
  })
}

resource "aws_iam_role_policy_attachment" "fake_api_iam_role_policy_attachment" {
  count = var.environment == "test" ? 1 : 0

  role       = aws_iam_role.terraform_iam_role.name
  policy_arn = aws_iam_policy.fake_api_iam_role_permissions[0].arn
}

########################
# Load Generator permissions
########################
resource "aws_iam_policy" "load_generator_iam_role_permissions" {
  count = var.environment == "test" ? 1 : 0

  name = "${var.prefix}-load-generator-iam-role-policy"
  policy = templatefile("${path.module}/policies/permissions/test/load-generator.json", {
    account_id : var.account_id
    region : var.region
  })
}

resource "aws_iam_role_policy_attachment" "load_generator_iam_role_policy_attachment" {
  count = var.environment == "test" ? 1 : 0

  role       = aws_iam_role.terraform_iam_role.name
  policy_arn = aws_iam_policy.load_generator_iam_role_permissions[0].arn
}
