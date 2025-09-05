# --- ECR ---
resource "aws_ecr_repository" "main" {
  name = var.name
  tags = {
    Name = "${var.name}-repo"
  }
}

# --- CloudWatch ---
resource "aws_cloudwatch_log_group" "main" {
  name = "/ecs/${var.name}"
  tags = {
    Name = "${var.name}-log-group"
  }
}

# --- Service Security Group ---
resource "aws_security_group" "service_sg" {
  name        = "${var.name}-service-sg"
  description = "Allow inbound traffic from the ALB to Fargate service"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [var.alb_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.name}-service-sg"
  }
}

# --- Target Group & Listener ---
resource "aws_lb_target_group" "main" {
  name        = "${var.name}-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = var.health_check_path
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
  tags = {
    Name = "${var.name}-tg"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = var.alb_arn
  port              = var.listener_port
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }
}

# --- Task Definition ---
resource "aws_ecs_task_definition" "main" {
  family                   = var.name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "${var.name}-container"
      image     = "${aws_ecr_repository.main.repository_url}:${var.image_tag}"
      essential = true
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.main.name
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
  tags = {
    Name = "${var.name}-task-def"
  }
}

# --- ECS Service ---
resource "aws_ecs_service" "main" {
  name                              = var.name
  cluster                           = var.ecs_cluster_id
  task_definition                   = aws_ecs_task_definition.main.arn
  desired_count                     = var.min_capacity
  launch_type                       = "FARGATE"
  health_check_grace_period_seconds = 60

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.service_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = "${var.name}-container"
    container_port   = var.container_port
  }

  # Ensure the listener is created before the service tries to register with it.
  depends_on = [aws_lb_listener.http]

  tags = {
    Name = "${var.name}-ecs-service"
  }
}

# --- Autoscaling ---
resource "aws_appautoscaling_target" "main" {
  max_capacity       = var.max_capacity
  min_capacity       = var.min_capacity
  resource_id        = "service/${var.ecs_cluster_name}/${aws_ecs_service.main.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
  role_arn           = var.ecs_autoscale_role_arn
}

resource "aws_cloudwatch_metric_alarm" "high_latency" {
  alarm_name          = "${var.name}-high-latency"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "Average"
  threshold           = var.scale_up_threshold_ms / 1000 # Convert ms to seconds
  dimensions = {
    LoadBalancer = split("/", var.alb_arn)[1]
    TargetGroup  = aws_lb_target_group.main.arn_suffix
  }
  alarm_actions = [aws_appautoscaling_policy.scale_up.arn]
}

resource "aws_cloudwatch_metric_alarm" "low_latency" {
  alarm_name          = "${var.name}-low-latency"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "10"
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "Average"
  threshold           = var.scale_down_threshold_ms / 1000 # Convert ms to seconds
  dimensions = {
    LoadBalancer = split("/", var.alb_arn)[1]
    TargetGroup  = aws_lb_target_group.main.arn_suffix
  }
  alarm_actions = [aws_appautoscaling_policy.scale_down.arn]
}

resource "aws_appautoscaling_policy" "scale_up" {
  name               = "${var.name}-scale-up"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.main.resource_id
  scalable_dimension = aws_appautoscaling_target.main.scalable_dimension
  service_namespace  = aws_appautoscaling_target.main.service_namespace
  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"
    step_adjustment {
      metric_interval_lower_bound = 0
      scaling_adjustment          = 1
    }
  }
}

resource "aws_appautoscaling_policy" "scale_down" {
  name               = "${var.name}-scale-down"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.main.resource_id
  scalable_dimension = aws_appautoscaling_target.main.scalable_dimension
  service_namespace  = aws_appautoscaling_target.main.service_namespace
  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 300
    metric_aggregation_type = "Average"
    step_adjustment {
      metric_interval_upper_bound = 0
      scaling_adjustment          = -1
    }
  }
}
