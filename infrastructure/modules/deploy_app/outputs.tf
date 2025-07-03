output "cloudfront_url" {
  value       = module.deploy_app.cloudfront_url
  description = "The URL for the cloudfront distribution"
}

output "cloudfront_distribution_id" {
  value       = module.deploy_app.cloudfront_distribution_id
  description = "The ID of the cloudfront distribution"
}
