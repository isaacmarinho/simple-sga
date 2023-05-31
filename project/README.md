# Simple SGA
SGA is the acronym for "Sistema de Gestão Ambiental" (EMS in English), i.e., a system to manage projects with environmental impact.

The system contains the following modules:
- admin: the module to manage users and projects
- attachment: the module for GED (an acronym for "Gestão Eletrônica de Documentos" - EDM in English)
- core: the module for the project's main functionalities, i.e., checking "about to expire"/"expired" processes & contracts and notifying the users
- environmental: the module for environmental process/contracts management
- messaging: the module for message queue management and email notification
- mining: the module for mining process/contracts management
- misc-contracts: the module for other process/contracts management, such as operating permits, Fire Department Inspection Reports, Fire Department License Certificate, etc.
- sga-app: the frontend to access all the microservices above