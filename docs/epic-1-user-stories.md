# Epic 1: Foundation & MVP Todo CRUD - User Stories

**Product Owner**: Sarah  
**Epic Goal**: Deliver full vertical slice: auth, task CRUD, filters, audit API, Heroku deploy  
**Status**: Ready for Development (91% confidence)  
**Timeline**: 10-14 days estimated

---

## 📋 Story 1.1: Turborepo & Heroku Pipeline Setup

### **Story Title**: Infrastructure Foundation & Deployment Pipeline

**As a** development team  
**I want** a properly configured Turborepo monorepo with automated Heroku deployment pipeline  
**So that** we can develop, test, and deploy GovDo efficiently with proper CI/CD practices

### **Acceptance Criteria**

#### **AC1: Turborepo Configuration**
- ✅ **GIVEN** the current Laravel 11 app structure
- ✅ **WHEN** Turborepo is implemented
- ✅ **THEN** the project structure follows the architecture specification:
```
monorepo/
├── apps/
│   └── web/           # Existing Laravel 11 app
├── packages/
│   └── ui/            # Shared React components
├── turbo.json         # Turborepo configuration
└── package.json       # Root workspace configuration
```

#### **AC2: Shared UI Package**
- ✅ **GIVEN** the need for reusable components
- ✅ **WHEN** packages/ui is created
- ✅ **THEN** it includes:
  - Basic component structure (Button, Modal, Input)
  - Tailwind CSS configuration with GovDo design tokens
  - TypeScript setup for component exports
  - Build pipeline for component distribution

#### **AC3: Heroku Pipeline Configuration**
- ✅ **GIVEN** the deployment requirements
- ✅ **WHEN** Heroku pipeline is configured
- ✅ **THEN** it includes:
  - **Staging app**: `govdo-staging` with JawsDB + Redis
  - **Production app**: `govdo-prod` (placeholder)
  - Automatic deployments from `main` branch to staging
  - GitHub Actions workflow for build/test/deploy

#### **AC4: Test Deployment Validation**
- ✅ **GIVEN** the staging environment
- ✅ **WHEN** a test deployment is performed
- ✅ **THEN**:
  - Laravel 11 app boots successfully (≤750ms cold start)
  - Database migrations run without errors
  - Basic authentication pages render correctly
  - SSL/HTTPS enforced with HSTS headers

### **Technical Implementation Details**

#### **Dependencies**
- Turborepo CLI installation
- Heroku CLI and account setup
- GitHub Actions secrets configuration
- JawsDB MariaDB add-on
- Heroku Redis add-on

#### **Configuration Files Needed**
1. `turbo.json` - Build pipeline configuration
2. Root `package.json` - Workspace management
3. `packages/ui/package.json` - UI component library
4. `.github/workflows/deploy.yml` - CI/CD pipeline
5. `Procfile` - Heroku process definition
6. `heroku.yml` - Container deployment config

#### **Environment Variables**
- `APP_KEY`, `APP_ENV=staging`
- `DB_*` variables for JawsDB
- `REDIS_URL` for session/cache
- `SESSION_SECURE_COOKIE=true`

### **Definition of Done**
- [ ] Turborepo successfully builds all packages
- [ ] Staging app deploys and runs without errors
- [ ] SSL certificate active with HSTS headers
- [ ] Database connection established
- [ ] Laravel Breeze authentication flows work
- [ ] GitHub Actions workflow passes all steps
- [ ] Documentation updated with deployment process

**Effort Estimate**: 2-3 days  
**Risk Level**: Medium (Heroku configuration complexity)  
**Dependencies**: None (foundational story)

---

## 📋 Story 1.2: Database Schema & System Versioning

### **Story Title**: Task Model with Audit Trail Implementation

**As a** government staff user  
**I want** all task changes to be automatically tracked with tamper-evident audit history  
**So that** I can maintain compliance with government record-keeping requirements and track all modifications

### **Acceptance Criteria**

#### **AC1: Task Model & Migration**
- ✅ **GIVEN** the need for task management
- ✅ **WHEN** the database schema is implemented
- ✅ **THEN** the `tasks` table includes:
```sql
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(160) NOT NULL,
  description TEXT NULL,
  priority ENUM('normal','resident','emergency') DEFAULT 'normal',
  due_date DATE NULL,
  completed_at TIMESTAMP NULL,
  modified_by BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (modified_by) REFERENCES users(id),
  PERIOD FOR SYSTEM_TIME(row_start, row_end)
) WITH SYSTEM VERSIONING;
```

#### **AC2: System Versioning Configuration**
- ✅ **GIVEN** audit trail requirements (NFR2)
- ✅ **WHEN** system versioning is enabled
- ✅ **THEN**:
  - The audit/history endpoint (`/tasks/history`) is implemented using a **SELECT query in the TaskRepository** that leverages MariaDB's system versioning on the `tasks` table
  - The query compares each version of a task row to its previous version and, for each change, outputs:
    - The task ID
    - The fields that changed (title, description, priority, due_date, modified_by)
    - The old and new values for each field
    - The timestamp of the change (from system versioning period columns)
    - The user who made the change (from `modified_by`)
  - No application-level triggers or manual history tables are used; all history is derived from the system-versioned table
  - The API response clearly indicates which fields changed and their before/after values

#### **AC3: Task Eloquent Model**
- ✅ **GIVEN** Laravel ORM integration
- ✅ **WHEN** Task model is implemented
- ✅ **THEN** it includes:
  - Proper fillable attributes and validation rules
  - Relationship to User model (`modified_by`)
  - Scope methods for filtering (pending, completed, all)
  - Custom accessor for formatted due dates

#### **AC4: Demo Data Seeding**
- ✅ **GIVEN** the need for development/testing data
- ✅ **WHEN** database seeder runs
- ✅ **THEN**:
  - 15-20 sample tasks created with varied priorities
  - Mix of pending and completed statuses
  - Realistic government communication task examples
  - Proper user associations for `modified_by`

### **Technical Implementation Details**

#### **Migration Requirements**
1. **Create tasks table migration** with system versioning
2. **Configure MariaDB system versioning** in database connection
3. **Add indexes** for performance (status, due_date, modified_by)
4. **Partition history table** by month for pruning

#### **Model Implementation**
```php
// app/Models/Task.php
class Task extends Model {
    protected $fillable = ['title', 'description', 'priority', 'due_date'];
    
    public function modifier() {
        return $this->belongsTo(User::class, 'modified_by');
    }
    
    public function scopePending($query) {
        return $query->whereNull('completed_at');
    }
    
    public function scopeCompleted($query) {
        return $query->whereNotNull('completed_at');
    }
}
```

#### **Database Configuration**
- MariaDB system versioning enabled globally
- Proper timezone configuration for accurate timestamps
- History table retention policy (6 months minimum)

### **Definition of Done**
- [ ] Migration creates system-versioned tasks table
- [ ] Task Eloquent model with relationships functional
- [ ] Database seeder populates realistic demo data
- [ ] System versioning confirmed working (INSERT/UPDATE creates history)
- [ ] Model unit tests pass for CRUD operations
- [ ] Performance indexes created and tested
- [ ] MariaDB configuration documented

**Effort Estimate**: 1-2 days  
**Risk Level**: High (System versioning complexity)  
**Dependencies**: Story 1.1 (Database connection established)

---

## 📋 Story 1.3: Task List & Filters Interface

### **Story Title**: Mobile-First Task Dashboard with Filtering

**As a** government staff member  
**I want** to view all my communication tasks in a mobile-optimized list with filter options  
**So that** I can quickly see pending work, completed items, or all tasks while working on my phone or tablet

### **Acceptance Criteria**

#### **AC1: Mobile-First Task List Layout**
- ✅ **GIVEN** I'm accessing GovDo on a mobile device (≥360px width)
- ✅ **WHEN** I navigate to the dashboard
- ✅ **THEN** I see:
  - Sticky header with "GovDo" title in Averia Serif Libre font
  - Filter chips row: "Pending" | "Completed" | "All" 
  - Task list in single column with cards
  - FAB "+ New Task" button (bottom-right)
  - Government branding colors (#0087bd primary, #8071b7 secondary)

#### **AC2: Task Card Information Display**
- ✅ **GIVEN** tasks exist in the system
- ✅ **WHEN** I view the task list
- ✅ **THEN** each task card shows:
  - **Title** (truncated at 2 lines if long)
  - **Priority indicator** (color-coded: normal=blue, resident=orange, emergency=red)
  - **Due date** (if set, formatted as "Due Jun 28")
  - **Status badge** (Pending/Completed)
  - **Tap area** for editing (entire card clickable)

#### **AC3: Filter Functionality**
- ✅ **GIVEN** I want to filter my task view
- ✅ **WHEN** I tap a filter chip
- ✅ **THEN**:
  - Active filter highlighted with primary color (#0087bd)
  - Task list updates instantly (no loading spinner needed)
  - URL updates to reflect filter (?status=pending)
  - Filter state persists on page refresh

#### **AC4: Task Sorting & Performance**
- ✅ **GIVEN** multiple tasks exist
- ✅ **WHEN** the list loads or updates
- ✅ **THEN**:
  - **New and recently changed tasks appear at top** (FR6)
  - List renders within 300ms median response time (NFR4)
  - Smooth scrolling without performance issues
  - No scroll position preservation needed

#### **AC5: Empty State Handling**
- ✅ **GIVEN** no tasks match the current filter
- ✅ **WHEN** I view the filtered list
- ✅ **THEN** I see:
  - Friendly empty state message
  - Suggestion to create first task or change filter
  - "+ New Task" action remains accessible

### **Technical Implementation Details**

#### **Components Required**
1. **TaskList.tsx** - Main list container
2. **TaskCard.tsx** - Individual task display
3. **FilterChips.tsx** - Status filter buttons
4. **EmptyState.tsx** - No results display
5. **FABButton.tsx** - Floating action button

#### **API Integration**
```typescript
// GET /tasks?status=pending|completed|all
interface TaskListResponse {
  data: Task[];
  meta: {
    total: number;
    current_filter: 'pending' | 'completed' | 'all';
  }
}
```

#### **Mobile UX Patterns**
- **Touch targets**: Minimum 44px height for accessibility
- **Responsive breakpoints**: Tailwind defaults
- **Loading states**: shadcn Skeleton cards while fetching data

#### **Styling Implementation**
```css
/* Key mobile-first styles */
.task-list { @apply space-y-3 px-4 pb-20; }
.task-card { @apply bg-white rounded-lg shadow-sm border p-4 active:bg-gray-50; }
.filter-chips { @apply flex gap-2 px-4 py-3 sticky top-16 bg-white z-10; }
.fab-button { @apply fixed bottom-6 right-6 bg-govdo-primary text-white; }
```

### **Definition of Done**
- [ ] Mobile layout renders correctly on 360px+ screens
- [ ] All filter states work and persist in URL
- [ ] Task cards display all required information clearly
- [ ] Performance meets <300ms response time requirement
- [ ] Government color scheme properly implemented
- [ ] Touch targets meet accessibility standards (44px min)
- [ ] Empty states provide helpful messaging
- [ ] Component tests cover filter and display logic

**Effort Estimate**: 2-3 days  
**Risk Level**: Medium (Mobile responsiveness complexity)  
**Dependencies**: Story 1.2 (Task model and API endpoints)

---

## 📋 Story 1.4: Task CRUD Modals & Mobile UX

### **Story Title**: Task Creation, Editing & Deletion with shadcn/ui Components

**As a** government staff member  
**I want** to create, edit, complete, and delete tasks using shadcn/ui components with optimal mobile UX  
**So that** I can manage my communication tasks efficiently in ≤3 taps with clear feedback for network errors

### **Acceptance Criteria**

#### **AC1: Task Creation Modal with shadcn Components**
- ✅ **GIVEN** I want to create a new task
- ✅ **WHEN** I tap the "+ New Task" FAB button
- ✅ **THEN** a shadcn Dialog opens with:
  - **shadcn Form components** for title (Input), description (Textarea), priority (RadioGroup), due date (Calendar/DatePicker)
  - **Form validation** using shadcn form patterns with error messages
  - **shadcn Button components** for Save/Cancel actions
  - **Character counter** for title field (showing 140/160 chars)
  - **Mobile-optimized presentation** (responsive Dialog sizing)

#### **AC2: ≤3 Taps Validation & Measurement**
- ✅ **GIVEN** I want to perform any task action
- ✅ **WHEN** I complete the action workflow
- ✅ **THEN**:
  - **Create task**: FAB tap → form fill → Save tap = 2 taps + typing
  - **Edit task**: Card tap → modify → Save tap = 2 taps + editing  
  - **Complete task**: Card tap → "Mark Complete" tap = 2 taps
  - **Delete task**: Card tap → Delete button → Confirm = 3 taps
  - **Tap count tracking** implemented for testing validation
  - **Actions measured from page load** to completion

#### **AC3: Network Error Handling (Enhanced)**
- ✅ **GIVEN** a network error occurs (500, timeout, connection lost)
- ✅ **WHEN** I attempt a task operation
- ✅ **THEN**:
  - **shadcn Toast notification** appears with clear error message
  - **Retry mechanism** provided with "Try Again" button
  - **Form data preserved** during network failures
  - **Graceful degradation** - UI remains functional
  - **Specific 500 error handling** as per PRD requirement
  - **Loading states** using shadcn Skeleton components

#### **AC4: Task Editing with Pre-population**
- ✅ **GIVEN** I have a pending task
- ✅ **WHEN** I tap the task card
- ✅ **THEN** the shadcn Dialog opens with:
  - **All form fields pre-populated** with current task data
  - **shadcn components properly initialized** with existing values
  - **"Mark Complete" Button** prominently displayed if status is pending
  - **Delete option** available as secondary action (destructive styling)

#### **AC5: Task Deletion with Confirmation**
- ✅ **GIVEN** I want to delete a task
- ✅ **WHEN** I select the delete option
- ✅ **THEN**:
  - **shadcn AlertDialog** appears with confirmation message
  - **Destructive action styling** using shadcn variant patterns
  - **Clear action buttons**: "Cancel" and "Delete Task"
  - **Task removal animation** on successful deletion

#### **AC6: Mobile-First shadcn Implementation**
- ✅ **GIVEN** I'm using GovDo on mobile devices
- ✅ **WHEN** I interact with task modals
- ✅ **THEN**:
  - **Responsive Dialog sizing** using shadcn responsive patterns
  - **Touch-optimized components** (44px minimum touch targets)
  - **Proper focus management** and keyboard navigation
  - **shadcn accessibility features** enabled (ARIA labels, focus rings)

### **Technical Implementation Details**

#### **Required shadcn/ui Components**
```typescript
// Core dialog and form components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Toast, ToastAction } from "@/components/ui/toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
```

#### **Enhanced Error Handling Implementation**
```typescript
// Network error handling with retry mechanism
const handleTaskSubmit = async (data: TaskFormData) => {
  try {
    setIsLoading(true)
    await submitTask(data)
    toast({ title: "Task saved successfully" })
  } catch (error) {
    if (error.status === 500) {
      toast({
        variant: "destructive",
        title: "Server Error",
        description: "Something went wrong on our end. Please try again.",
        action: <ToastAction altText="Retry" onClick={() => handleTaskSubmit(data)}>Try Again</ToastAction>
      })
    } else {
      // Handle other network errors
      toast({
        variant: "destructive", 
        title: "Connection Error",
        description: "Check your internet connection and try again."
      })
    }
  } finally {
    setIsLoading(false)
  }
}
```

#### **Tap Count Measurement**
```typescript
// Tap tracking for validation
const useTapCounter = () => {
  const [tapCount, setTapCount] = useState(0)
  const recordTap = () => setTapCount(prev => prev + 1)
  const resetTaps = () => setTapCount(0)
  return { tapCount, recordTap, resetTaps }
}
```

### **Definition of Done**
- [ ] All modals implemented using shadcn/ui components exclusively
- [ ] ≤3 taps requirement validated with automated tap counting
- [ ] Network error handling includes specific 500 error scenarios
- [ ] Toast notifications work for all error and success states
- [ ] Form validation uses shadcn form patterns
- [ ] Mobile touch targets meet 44px accessibility minimum
- [ ] Retry mechanisms functional for all network failures
- [ ] Component tests cover error boundaries and retry logic
- [ ] shadcn accessibility features properly implemented
- [ ] Performance meets mobile optimization standards
- [ ] All tap count scenarios documented and tested

**Effort Estimate**: 4-5 days  
**Risk Level**: Medium-High (shadcn integration + error handling complexity)  
**Dependencies**: Story 1.3 (Task list interface), shadcn/ui setup in packages/ui

---

## 📈 Epic 1 Summary

**Total Estimated Effort**: 10-14 days  
**Development Sequence**: 1.1 & 1.2 (parallel) → 1.3 → 1.4  
**Overall Readiness**: 91% - Ready for Development

### Critical Success Factors
- System versioning implementation (Story 1.2)
- Mobile-first responsive design (Stories 1.3 & 1.4)
- shadcn/ui component integration (Story 1.4)
- Performance targets (300ms response, 750ms cold start)

### Risk Mitigation
- Assign senior developer to Story 1.2 (system versioning)
- Prototype mobile UX patterns early
- Allow extra iteration time for Heroku configuration