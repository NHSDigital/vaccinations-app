output "arn" {
  description = "The ARN of the ALB."
  value       = aws_lb.main.arn
}

output "dns_name" {
  description = "The public DNS name of the ALB."
  value       = aws_lb.main.dns_name
}

output "security_group_id" {
  description = "The ID of the ALB's security group."
  value       = aws_security_group.lb_sg.id
}
