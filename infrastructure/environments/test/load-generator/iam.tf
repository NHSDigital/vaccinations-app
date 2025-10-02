# IAM role that allows ECS tasks to make API calls to other AWS services.
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${local.project}-ecs-task-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

# Attach the policy that provides permissions to pull from ECR and send logs to CloudWatch.
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Attach the policy that allows ECS tasks to read/write to S3 bucket
resource "aws_iam_role_policy" "ecs_task_to_s3_access_policy" {
  name = "${local.project}-ecs-to-s3"
  role = aws_iam_role.ecs_task_execution_role.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["s3:PutObject", "s3:GetObject"]
        Effect   = "Allow"
        Resource = "arn:aws:s3:::${var.s3_bucket_name}/*"
      }
    ]
  })
}
