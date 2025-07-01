resource "aws_iam_role" "chatbot_iam_role" {
  name = "${var.prefix}-chatbot-iam-role"
  assume_role_policy = templatefile("${path.module}/policies/chatbot-iam-role.json", {})
}
