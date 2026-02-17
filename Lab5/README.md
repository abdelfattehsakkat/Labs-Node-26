# Lab 5: Introduction to Ansible and Playbooks

## Overview

In this lab, you will learn the fundamentals of Ansible and how to use playbooks to automate system configuration and management tasks. The playbook is already created and ready to run - your focus will be on understanding Ansible concepts, running the playbook, and learning how to write your own automation tasks.

## Prerequisites

- WSL (Windows Subsystem for Linux) or Linux environment
- Ansible installed on your system
- Basic understanding of YAML syntax
- Basic command-line knowledge

## What is Ansible?

Ansible is an open-source automation tool that allows you to:
- **Configure systems** - Set up and configure servers
- **Deploy applications** - Automate application deployment
- **Orchestrate tasks** - Coordinate complex multi-step processes
- **Manage infrastructure** - Maintain consistent system states

### Key Concepts

**Playbooks**: YAML files that define a series of tasks to be executed.

**Tasks**: Individual units of work (create file, install package, etc.).

**Modules**: Reusable components that perform specific actions (file, copy, debug, etc.).

**Variables**: Dynamic values that can be used throughout playbooks.

**Inventory**: List of hosts/servers to manage (we'll use localhost).

**Idempotent**: Running the same playbook multiple times produces the same result.

---

## Installing Ansible

### On Ubuntu/Debian (WSL)

```bash
sudo apt update
sudo apt install ansible -y
```

### Verify Installation

```bash
ansible --version
```

Expected output:
```
ansible [core 2.x.x]
  config file = /etc/ansible/ansible.cfg
  configured module search path = ['/home/user/.ansible/plugins/modules']
  ansible python module location = /usr/lib/python3/dist-packages/ansible
  executable location = /usr/bin/ansible
  python version = 3.x.x
```

---

## Part 1: Understanding the Playbook Structure

### Step 1: Review the Playbook File

Open [ansible-playbook.yml](ansible-playbook.yml) and examine the structure:

```yaml
---
- name: Ansible Playbook Demonstration
  hosts: localhost
  connection: local
  gather_facts: yes
```

**Explanation:**
- `---` - YAML document start marker
- `name` - Human-readable description of the play
- `hosts: localhost` - Target host (our local machine)
- `connection: local` - Connect directly without SSH
- `gather_facts: yes` - Collect system information before running tasks

### Step 2: Understanding Variables

Variables allow you to reuse values throughout the playbook:

```yaml
vars:
  demo_dir: /tmp/ansible-demo
  app_name: "Ansible Demo App"
  version: "1.0.0"
  environments:
    - dev
    - staging
    - prod
```

**Usage in tasks:**
- `{{ demo_dir }}` - Access the demo_dir variable
- `{{ environments }}` - Access the list of environments
- Variables make playbooks flexible and reusable

### Step 3: Understanding Tasks

Tasks are the actual work units:

```yaml
tasks:
  - name: Display welcome message
    debug:
      msg: "Welcome to {{ app_name }} version {{ version }}"
```

**Components:**
- `name` - Task description (shown during execution)
- `debug` - Ansible module to display messages
- `msg` - Message content with variable interpolation

---

## Part 2: Ansible Modules Demonstrated

This playbook demonstrates several key Ansible modules:

### 1. Debug Module

Displays messages and variables:

```yaml
- name: Display welcome message
  debug:
    msg: "Welcome to {{ app_name }} version {{ version }}"
```

**Use cases:**
- Debugging playbook execution
- Displaying information to users
- Showing variable values

### 2. File Module

Creates directories:

```yaml
- name: Create demo directory
  file:
    path: "{{ demo_dir }}"
    state: directory
    mode: '0755'
```

**Parameters:**
- `path` - Directory/file path
- `state: directory` - Ensure it's a directory
- `mode` - File permissions (rwxr-xr-x)

### 3. Copy Module

Creates files with specific content:

```yaml
- name: Create a configuration file
  copy:
    content: |
      APP_NAME={{ app_name }}
      VERSION={{ version }}
    dest: "{{ demo_dir }}/config.env"
    mode: '0644'
```

**Parameters:**
- `content` - File content (supports multiline with `|`)
- `dest` - Destination path
- `mode` - File permissions

### 4. Stat Module

Checks if files/directories exist:

```yaml
- name: Check if demo directory exists
  stat:
    path: "{{ demo_dir }}"
  register: dir_status
```

**Features:**
- `register` - Saves output to a variable
- Useful for conditional logic

### 5. Find Module

Searches for files:

```yaml
- name: List created files
  find:
    paths: "{{ demo_dir }}"
    recurse: yes
  register: created_files
```

**Parameters:**
- `paths` - Where to search
- `recurse: yes` - Search subdirectories

### 6. Loops

Iterate over lists:

```yaml
- name: Create environment subdirectories
  file:
    path: "{{ demo_dir }}/{{ item }}"
    state: directory
  loop: "{{ environments }}"
```

**Explanation:**
- `loop` - Iterates over the environments list
- `{{ item }}` - Current iteration value

---

## Part 3: Running the Playbook

### Step 1: Navigate to Lab5 Directory

```bash
cd /home/sakkat/workspaces/training-26/Labs-Node-26/Lab5
```

### Step 2: Run the Playbook

Execute the playbook:

```bash
ansible-playbook ansible-playbook.yml
```

**Expected Output:**

```
[WARNING]: No inventory was parsed, only implicit localhost is available
[WARNING]: provided hosts list is empty, only localhost is available

PLAY [Ansible Playbook Demonstration] ******************************************

TASK [Gathering Facts] *********************************************************
ok: [localhost]

TASK [Display welcome message] *************************************************
ok: [localhost] => {
    "msg": "Welcome to Ansible Demo App version 1.0.0"
}

TASK [Show system information] *************************************************
ok: [localhost] => {
    "msg": "Running on Ubuntu 22.04"
}

TASK [Create demo directory] ***************************************************
changed: [localhost]

TASK [Create environment subdirectories] ***************************************
changed: [localhost] => (item=dev)
changed: [localhost] => (item=staging)
changed: [localhost] => (item=prod)

... (more tasks)

PLAY RECAP *********************************************************************
localhost                  : ok=14   changed=8    unreachable=0    failed=0
```

### Step 3: Understanding the Output

**Color Coding:**
- **Green (ok)** - Task completed, no changes made
- **Yellow (changed)** - Task completed with changes
- **Red (failed)** - Task failed
- **Orange (skipped)** - Task was skipped

**PLAY RECAP:**
- `ok` - Number of successful tasks
- `changed` - Number of tasks that made changes
- `unreachable` - Hosts that couldn't be reached
- `failed` - Number of failed tasks

### Step 4: Run with Verbose Mode

For more detailed output:

```bash
ansible-playbook ansible-playbook.yml -v
```

**Verbosity Levels:**
- `-v` - Verbose
- `-vv` - More verbose
- `-vvv` - Very verbose (connection debugging)
- `-vvvv` - Maximum verbosity (everything)

---

## Part 4: Verifying the Results

### Step 1: Check the Created Directory

```bash
ls -la /tmp/ansible-demo
```

Expected output:
```
total 20
drwxr-xr-x  5 sakkat sakkat 4096 Feb 16 10:30 .
drwxrwxrwt 20 root   root   4096 Feb 16 10:30 ..
-rw-r--r--  1 sakkat sakkat  123 Feb 16 10:30 config.env
drwxr-xr-x  2 sakkat sakkat 4096 Feb 16 10:30 dev
-rw-r--r--  1 sakkat sakkat   45 Feb 16 10:30 last_run.txt
-rw-r--r--  1 sakkat sakkat  234 Feb 16 10:30 manifest.json
drwxr-xr-x  2 sakkat sakkat 4096 Feb 16 10:30 prod
drwxr-xr-x  2 sakkat sakkat 4096 Feb 16 10:30 staging
```

### Step 2: View the Configuration File

```bash
cat /tmp/ansible-demo/config.env
```

Expected output:
```
# Ansible Demo App Configuration
# Generated on 2026-02-16T10:30:00.000Z

APP_NAME=Ansible Demo App
VERSION=1.0.0
ENVIRONMENT=production
LOG_LEVEL=info
```

### Step 3: View the JSON Manifest

```bash
cat /tmp/ansible-demo/manifest.json
```

Expected output:
```json
{
  "app": "Ansible Demo App",
  "version": "1.0.0",
  "timestamp": "2026-02-16T10:30:00.000Z",
  "host": "mSAKKAT1-PC",
  "environments": ["dev", "staging", "prod"]
}
```

### Step 4: Check Environment Files

```bash
cat /tmp/ansible-demo/dev/info.txt
```

Expected output:
```
Environment: dev
Created: 2026-02-16T10:30:00.000Z
Host: mSAKKAT1-PC
```

### Step 5: View Last Run Timestamp

```bash
cat /tmp/ansible-demo/last_run.txt
```

Expected output:
```
Playbook executed at 2026-02-16T10:30:00.000Z
```

---

## Part 5: Idempotency Testing

One of Ansible's key features is **idempotency** - running the same playbook multiple times produces the same result.

### Step 1: Run the Playbook Again

```bash
ansible-playbook ansible-playbook.yml
```

### Step 2: Observe the Output

Notice that most tasks show **ok** (green) instead of **changed** (yellow):

```
TASK [Create demo directory] ***************************************************
ok: [localhost]

TASK [Create environment subdirectories] ***************************************
ok: [localhost] => (item=dev)
ok: [localhost] => (item=staging)
ok: [localhost] => (item=prod)
```

**Why?**
- Ansible checks current state before making changes
- If the desired state already exists, no changes are made
- Only the marker file gets updated (new timestamp)

This is **idempotency** in action!

---

## Part 6: Modifying the Playbook

### Example 1: Add a New Environment

Edit the playbook and add a new environment:

```yaml
vars:
  demo_dir: /tmp/ansible-demo
  app_name: "Ansible Demo App"
  version: "1.0.0"
  environments:
    - dev
    - staging
    - prod
    - qa          # New environment
```

Run the playbook again:
```bash
ansible-playbook ansible-playbook.yml
```

Only the `qa` directory will be created (others already exist).

### Example 2: Add a New Task

Add a task to create a README file:

```yaml
- name: Create README file
  copy:
    content: |
      # {{ app_name }}
      
      Version: {{ version }}
      
      ## Environments
      {% for env in environments %}
      - {{ env }}
      {% endfor %}
    dest: "{{ demo_dir }}/README.md"
    mode: '0644'
```

### Example 3: Use Conditionals

Add a task that only runs on Ubuntu:

```yaml
- name: Display Ubuntu-specific message
  debug:
    msg: "Running on Ubuntu system"
  when: ansible_distribution == "Ubuntu"
```

---

## Part 7: Cleaning Up

### Remove the Demo Directory

```bash
rm -rf /tmp/ansible-demo
```

### Create a Cleanup Playbook

Create `cleanup.yml`:

```yaml
---
- name: Cleanup Demo Files
  hosts: localhost
  connection: local
  gather_facts: no
  
  vars:
    demo_dir: /tmp/ansible-demo
  
  tasks:
    - name: Remove demo directory
      file:
        path: "{{ demo_dir }}"
        state: absent
    
    - name: Confirm cleanup
      debug:
        msg: "Demo directory {{ demo_dir }} has been removed"
```

Run the cleanup:
```bash
ansible-playbook cleanup.yml
```

---

## Part 8: Ansible Best Practices

### 1. Use Meaningful Task Names

❌ Bad:
```yaml
- name: Create dir
  file: ...
```

✅ Good:
```yaml
- name: Create application configuration directory
  file: ...
```

### 2. Use Variables for Reusability

❌ Bad:
```yaml
- name: Create file
  copy:
    dest: /tmp/ansible-demo/config.env
```

✅ Good:
```yaml
- name: Create configuration file
  copy:
    dest: "{{ demo_dir }}/config.env"
```

### 3. Group Related Tasks

Use comments or separate plays for better organization:

```yaml
# Environment Setup
- name: Create directories
  ...

# Configuration Files
- name: Create config files
  ...
```

### 4. Use Handlers for Restarts

When configuration changes require service restarts:

```yaml
tasks:
  - name: Update configuration
    copy:
      src: config.conf
      dest: /etc/app/config.conf
    notify: restart application

handlers:
  - name: restart application
    service:
      name: myapp
      state: restarted
```

### 5. Test with --check Mode

Dry-run to see what would change:

```bash
ansible-playbook ansible-playbook.yml --check
```

### 6. Use Tags for Selective Execution

```yaml
- name: Install packages
  apt:
    name: nginx
  tags: install

- name: Configure application
  copy:
    src: config.yml
  tags: configure
```

Run only tagged tasks:
```bash
ansible-playbook playbook.yml --tags configure
```

---

## Part 9: Common Ansible Modules

### System Modules

**apt/yum** - Package management
```yaml
- name: Install nginx
  apt:
    name: nginx
    state: present
```

**service** - Service management
```yaml
- name: Start nginx
  service:
    name: nginx
    state: started
    enabled: yes
```

**user** - User management
```yaml
- name: Create application user
  user:
    name: appuser
    state: present
    shell: /bin/bash
```

### File Modules

**template** - Copy files with variable substitution
```yaml
- name: Deploy configuration template
  template:
    src: app.conf.j2
    dest: /etc/app/app.conf
```

**lineinfile** - Modify specific lines in files
```yaml
- name: Set timezone
  lineinfile:
    path: /etc/timezone
    line: "America/New_York"
```

### Command Modules

**command** - Execute commands
```yaml
- name: Check disk space
  command: df -h
  register: disk_space
```

**shell** - Execute shell commands
```yaml
- name: Run complex shell command
  shell: |
    cd /app
    npm install
    npm run build
```

---

## Part 10: Troubleshooting

### Playbook Fails to Run

**Problem:** `ansible: command not found`
```bash
Solution: Install Ansible
sudo apt install ansible
```

**Problem:** YAML syntax error
```
Solution: Validate YAML syntax
- Check indentation (use spaces, not tabs)
- Verify quotes and special characters
- Use online YAML validators
```

### Task Failures

**Problem:** Permission denied
```yaml
Solution: Add become: true for privilege escalation
- name: Install package
  apt:
    name: nginx
  become: true
```

**Problem:** File not found
```
Solution: Check paths and ensure directories exist
- Verify variable values with debug module
- Use absolute paths
```

### Debugging Tips

**1. Use Debug Module:**
```yaml
- name: Show variable value
  debug:
    var: my_variable
```

**2. Check Syntax:**
```bash
ansible-playbook playbook.yml --syntax-check
```

**3. List Tasks:**
```bash
ansible-playbook playbook.yml --list-tasks
```

**4. Step Through:**
```bash
ansible-playbook playbook.yml --step
```

---

## Part 11: Advanced Concepts

### Using Jinja2 Templates

Create `templates/config.j2`:
```jinja2
# {{ app_name }} Configuration
VERSION={{ version }}

{% for env in environments %}
ENVIRONMENT_{{ env | upper }}=true
{% endfor %}
```

Use in playbook:
```yaml
- name: Deploy configuration from template
  template:
    src: templates/config.j2
    dest: "{{ demo_dir }}/config.txt"
```

### Using Roles

Roles organize playbooks into reusable components:

```
roles/
  webserver/
    tasks/
      main.yml
    templates/
      nginx.conf.j2
    vars/
      main.yml
```

### Inventory Files

Create `inventory.ini`:
```ini
[webservers]
web1.example.com
web2.example.com

[databases]
db1.example.com

[all:vars]
ansible_user=ubuntu
```

Use with playbook:
```bash
ansible-playbook -i inventory.ini playbook.yml
```

---

## Summary

In this lab, you learned:

1. ✅ What Ansible is and its key concepts
2. ✅ How to install Ansible on WSL/Linux
3. ✅ Understanding playbook structure and YAML syntax
4. ✅ Working with variables and loops
5. ✅ Using common Ansible modules (debug, file, copy, stat, find)
6. ✅ Running playbooks and interpreting output
7. ✅ Understanding idempotency
8. ✅ Verifying playbook results
9. ✅ Modifying and extending playbooks
10. ✅ Best practices and troubleshooting
11. ✅ Advanced concepts (templates, roles, inventory)

---

## Next Steps

### Beginner Level
- Create a playbook that sets up a development environment
- Use Ansible to install and configure Git, Node.js, and Docker
- Practice with different modules (apt, service, user)

### Intermediate Level
- Create roles for common tasks
- Use Ansible Vault to encrypt sensitive data
- Write playbooks for multiple hosts using inventory files
- Implement handlers for service management

### Advanced Level
- Integrate Ansible with Docker (container management)
- Use Ansible Tower/AWX for GUI-based automation
- Create dynamic inventories
- Build CI/CD pipelines with Ansible
- Use Ansible with Kubernetes

### Practical Projects
- Automate web server deployment (Nginx/Apache)
- Set up monitoring stack (Prometheus, Grafana)
- Deploy ELK Stack (Elasticsearch, Logstash, Kibana)
- Configure database clusters
- Implement zero-downtime deployments

---

## Additional Resources

### Official Documentation
- [Ansible Documentation](https://docs.ansible.com/)
- [Ansible Module Index](https://docs.ansible.com/ansible/latest/collections/index_module.html)
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)

### Tutorials and Guides
- [Ansible for DevOps](https://www.ansiblefordevops.com/)
- [DigitalOcean Ansible Tutorials](https://www.digitalocean.com/community/tags/ansible)
- [Red Hat Ansible Learning](https://www.redhat.com/en/technologies/management/ansible/resources)

### Community
- [Ansible Galaxy](https://galaxy.ansible.com/) - Pre-built roles
- [Ansible GitHub](https://github.com/ansible/ansible)
- [Ansible Community Forum](https://forum.ansible.com/)

### Video Courses
- [Ansible for Beginners](https://www.youtube.com/results?search_query=ansible+tutorial)
- [Advanced Ansible Patterns](https://www.udemy.com/topic/ansible/)

---

## Quick Reference

### Common Commands

```bash
# Run playbook
ansible-playbook playbook.yml

# Check syntax
ansible-playbook playbook.yml --syntax-check

# Dry run (no changes)
ansible-playbook playbook.yml --check

# Verbose output
ansible-playbook playbook.yml -v

# List tasks
ansible-playbook playbook.yml --list-tasks

# Run specific tags
ansible-playbook playbook.yml --tags "install,configure"

# Skip tags
ansible-playbook playbook.yml --skip-tags "cleanup"

# Use custom inventory
ansible-playbook -i inventory.ini playbook.yml

# Limit to specific hosts
ansible-playbook playbook.yml --limit webservers
```

### Common Modules

```bash
# File operations
file, copy, template, lineinfile, blockinfile

# Package management
apt, yum, dnf, package

# Service management
service, systemd

# User management
user, group

# Command execution
command, shell, script

# Information gathering
debug, stat, find, setup

# Cloud modules
ec2, azure_rm, gcp_compute
```

---

**Congratulations!** You've completed Lab 5 and learned the fundamentals of Ansible automation. You're now ready to automate infrastructure tasks and build more complex playbooks.
