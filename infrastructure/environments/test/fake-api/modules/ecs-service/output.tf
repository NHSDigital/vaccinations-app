output "ecr_repository_url" {
  description = "The URL of the ECR repository for this service."
  value       = aws_ecr_repository.main.repository_url
}
