data "template_file" "server_lambda_additional_policy_template" {
  template = file("${path.module}/iam-policy.json")
}

resource "aws_iam_policy" "server_lambda_additional_policy" {
  name   = "${var.prefix}-server-lambda-additional-policy"
  policy = data.template_file.server_lambda_additional_policy_template.rendered
}
