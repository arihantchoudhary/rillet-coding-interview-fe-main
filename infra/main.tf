terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "vercel_api_token" {
  type      = string
  sensitive = true
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

provider "vercel" {
  api_token = var.vercel_api_token
}

provider "aws" {
  region = var.aws_region
}

# --- Backend: AWS App Runner ---

resource "aws_ecr_repository" "backend" {
  name                 = "rillet-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_apprunner_service" "backend" {
  service_name = "rillet-backend"

  source_configuration {
    authentication_configuration {
      access_role_arn = "arn:aws:iam::050451400186:role/AppRunnerECRAccessRole"
    }

    image_repository {
      image_identifier      = "${aws_ecr_repository.backend.repository_url}:latest"
      image_repository_type = "ECR"

      image_configuration {
        port = "3000"

        runtime_environment_variables = {
          NODE_ENV = "production"
        }
      }
    }

    auto_deployments_enabled = false
  }

  instance_configuration {
    cpu    = "256"
    memory = "512"
  }

  health_check_configuration {
    protocol            = "HTTP"
    path                = "/health"
    interval            = 5
    timeout             = 2
    healthy_threshold   = 1
    unhealthy_threshold = 5
  }
}

# --- Frontend: Vercel ---

resource "vercel_project" "frontend" {
  name      = "rillet-interview-frontend"
  framework = "vite"
}

output "backend_url" {
  value = "https://${aws_apprunner_service.backend.service_url}"
}

output "frontend_project" {
  value = vercel_project.frontend.name
}
