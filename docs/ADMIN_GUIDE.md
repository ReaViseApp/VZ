# Viz. Admin Panel Guide

Complete guide for administrators managing the Viz. creative community platform.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [User Management](#user-management)
4. [Content Moderation](#content-moderation)
5. [Site Settings](#site-settings)
6. [Activity Logs](#activity-logs)
7. [Best Practices](#best-practices)
8. [Security Guidelines](#security-guidelines)

---

## Getting Started

### First Login

1. **Access the login page**: Navigate to `/auth/login`
2. **Use default admin credentials**:
   - Email: `admin@viz.app`
   - Username: `vizadmin`
   - Password: `AdminViz2026!`
3. **⚠️ CRITICAL**: Change your password immediately after first login

### Accessing the Admin Panel

After logging in:
- Click your username in the top-right header
- Select "🛡️ Admin Panel" from the dropdown
- Or navigate directly to `/admin`

---

## Dashboard Overview (`/admin`)

Key metrics displayed:
- **Total Users**, **Active Users (7d)**, **Total Content**, **Editorials**
- **Viz.List Saves**, **Featured Content**, **Pending Approvals**
- **Banned/Suspended Users**

View recent activity and top content creators.

---

## User Management (`/admin/users`)

### Features
- Search users by username/email
- Filter by role (User, Moderator, Admin), status, verification
- Pagination (20 users per page)

### Actions

**Change Role**: Click role dropdown → Select new role → Confirm

**Suspend User** (temporary, 7 days default):
1. Click "Suspend"
2. Confirm action
3. User cannot post/interact until suspension expires

**Ban User** (permanent):
1. Click "Ban"
2. Confirm action
3. User cannot log in

**Note**: Cannot ban/suspend admin users

---

## Content Management (`/admin/content`)

### Features
- Filter by type (photo/video), status (approved/pending), featured status
- Grid view with previews

### Actions

**Feature Content**: Click "Feature" → Featured content appears on homepage with ⭐ badge

**Approve/Reject**: (when "Require Approval" is enabled)
- Click "Approve" to make content visible
- Rejection hides the content

---

## Site Settings (`/admin/settings`)

### Sections

1. **Site Identity**: Site name and description
2. **SEO Settings**: Meta title, description, keywords
3. **Theme Colors**: Primary, secondary, accent, font colors
4. **Feature Toggles**:
   - Enable Comments (future)
   - Enable Likes/Reactions
   - Enable Social Sharing
   - Require Content Approval

Click "Save Changes" to apply all settings.

---

## Activity Logs (`/admin/logs`)

Complete audit trail showing:
- **Timestamp**, **Admin User**, **Action Type**, **Target**, **Details**

Filter by action type or target type. View JSON details for each log entry.

Common actions logged:
- `USER_ROLE_CHANGED`, `USER_BANNED`, `USER_SUSPENDED`
- `CONTENT_FEATURED`, `CONTENT_APPROVED`
- `SETTINGS_UPDATED`

---

## Best Practices

### User Management
1. Only promote trusted users to Moderator/Admin
2. Document reasons for bans/suspensions
3. Be consistent with enforcement
4. Review moderator actions regularly

### Content Moderation
1. Apply consistent standards
2. Review flagged content within 24 hours
3. Feature diverse, high-quality content
4. Rotate featured content regularly

### Security
1. **Change default password immediately**
2. Use strong, unique passwords (12+ characters)
3. Don't share admin credentials
4. Log out after each session
5. Review activity logs weekly
6. Remove admin access when no longer needed

---

## Security Guidelines

### Password Requirements
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Don't reuse passwords
- Use a password manager

### Access Control
- Limit admin accounts to essential personnel
- Follow principle of least privilege
- Review access quarterly

### Monitoring
- Check activity logs regularly for suspicious activity
- Report security concerns immediately
- Document unusual patterns

---

## Common Tasks

### Daily
- Review flagged content
- Check pending approvals
- Monitor recent registrations

### Weekly
- Review activity logs
- Update featured content
- Check metrics and trends

### Monthly
- Audit user roles and permissions
- Review and update settings
- Analyze content trends

---

## Default Admin Credentials

**📧 Email**: `admin@viz.app`  
**👤 Username**: `vizadmin`  
**🔑 Password**: `AdminViz2026!`  
**🛡️ Role**: `ADMIN`

⚠️ **Change password immediately after first login!**

---

## Support

- GitHub Issues for bug reports
- Documentation in `/docs`
- Activity logs for troubleshooting

**Last Updated**: January 17, 2026  
**Version**: 1.0.0
