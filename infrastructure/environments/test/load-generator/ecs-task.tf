# --- Task Definition ---
resource "aws_ecs_task_definition" "load_generator_task" {
  family                   = local.project
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 2048
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  container_definitions = jsonencode([
    {
      name      = "${local.project}-container"
      image     = "${aws_ecr_repository.load_generator.repository_url}:latest"
      essential = true
      environment = [
        {
          name  = "DURATION"
          value = tostring(local.environment.DURATION)
        },
        {
          name  = "RAMPUP"
          value = tostring(local.environment.RAMPUP)
        },
        {
          name  = "THREADS"
          value = tostring(local.environment.THREADS)
        },
        {
          name  = "ENVIRONMENT"
          value = local.environment.ENVIRONMENT
        },
        {
          name  = "S3_BUCKET"
          value = local.environment.S3_BUCKET
        },
        {
          name  = "TEST_PLAN"
          value = local.environment.TEST_PLAN
        },
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${local.project}"
          "awslogs-create-group"  = "true"
          "awslogs-region"        = "eu-west-2"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Name = "${local.project}-task-definition"
  }
}
