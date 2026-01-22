# CashTrack Design Guidelines

## Brand Identity

**Purpose**: Effortless financial awareness through SMS intelligence. Automatically surfaces credit card settlements, balances, and category-specific promotions without manual entry.

**Aesthetic Direction**: **Data-First Editorial** - Clean, organized, information-dense without feeling cluttered. Inspired by financial dashboards and modern data visualization, with a premium, trustworthy feel. Think Bloomberg Terminal meets Google Material You.

**Memorable Element**: Category-colored transaction chips that pulse subtly when new SMS data arrives. Promotions appear as vibrant cards with expiration countdowns, creating urgency without anxiety.

## Navigation Architecture

**Root Navigation**: Bottom Navigation (4 tabs)
- **Home** - Dashboard with financial overview
- **Transactions** - Categorized spending list
- **Cards** - Credit card management and balances
- **Settings** - Preferences and account

**Floating Action Button**: Manual transaction entry (overlays bottom nav center)

## Screen-by-Screen Specifications

### 1. Home (Dashboard)
- **Purpose**: At-a-glance financial health
- **Header**: Transparent, current month/year title, right: calendar sync status icon
- **Layout**: Scrollable
  - Top inset: headerHeight + 24dp
  - Bottom inset: tabBarHeight + 24dp
- **Components**:
  - Balance summary card (total, available credit)
  - Upcoming settlements timeline (next 7 days)
  - Active promotions carousel (horizontal scroll)
  - Recent transactions (last 5)
- **Empty State**: "Waiting for SMS data" with setup instructions illustration

### 2. Transactions
- **Purpose**: Browse all detected financial SMS by category
- **Header**: Default with search bar, right: filter icon
- **Layout**: Scrollable list
  - Top inset: 24dp (non-transparent header)
  - Bottom inset: tabBarHeight + 24dp
- **Components**:
  - Category filter chips (All, Supermarket, Travel, Dining, Shopping, Bills)
  - Transaction cards: merchant name, amount, date, category badge, linked card
  - Pull-to-refresh
- **Empty State**: "No transactions detected yet" (empty-transactions.png)

### 3. Cards
- **Purpose**: Manage credit cards, view balances and settlement dates
- **Header**: Default, title "My Cards", right: add card icon
- **Layout**: Scrollable
  - Top inset: 24dp
  - Bottom inset: tabBarHeight + 24dp
- **Components**:
  - Card carousel (shows card brand, last 4 digits, balance, limit, settlement date)
  - "Linked Promotions" section below each card
  - Tap card → detail screen with transaction history
- **Empty State**: "Add your first card" (empty-cards.png)

### 4. Settings
- **Purpose**: App preferences and permissions
- **Header**: Default, title "Settings"
- **Layout**: Scrollable form
  - Top inset: 24dp
  - Bottom inset: tabBarHeight + 24dp
- **Components**:
  - User avatar + display name
  - SMS Permissions toggle (with explanation)
  - Google Calendar sync toggle
  - Notification preferences
  - Categories management
  - Theme selector (System, Light, Dark)
  - About/Privacy nested screens
- **No Empty State**

### 5. Promotion Detail (Modal)
- **Purpose**: View full promotion details and sync to calendar
- **Header**: Custom with close button (left), "Add to Calendar" (right)
- **Layout**: Scrollable
  - Top inset: headerHeight + 24dp
  - Bottom inset: insets.bottom + 24dp
- **Components**:
  - Promotion banner image
  - Category badge
  - Expiration countdown
  - Terms and conditions
  - Related card
  - "Add to Google Calendar" button (primary action)

## Color Palette

**Primary**: #1B5E20 (Forest Green) - Trust, growth, money
**Primary Variant**: #4CAF50 (Lighter green for accents)
**Background**: #FAFAFA (Warm gray, not pure white)
**Surface**: #FFFFFF
**Error**: #D32F2F (Settlement overdue)
**Warning**: #F57C00 (Settlement due soon)
**Success**: #388E3C (Promotion saved)

**Category Colors**:
- Supermarket: #FF6F00 (Orange)
- Travel: #1976D2 (Blue)
- Dining: #E91E63 (Pink)
- Shopping: #9C27B0 (Purple)
- Bills: #616161 (Gray)

**Text**:
- Primary: #212121
- Secondary: #757575
- Hint: #BDBDBD

## Typography

**Font**: Roboto (Material Design standard)
**Type Scale**:
- H1: 32sp, Bold (Dashboard balance)
- H2: 24sp, Medium (Section headers)
- Body1: 16sp, Regular (Transaction details)
- Body2: 14sp, Regular (Card info, dates)
- Caption: 12sp, Regular (Metadata, hints)
- Button: 14sp, Medium, All Caps

## Visual Design

- **Elevation**: Use Material elevation levels (cards: 2dp, FAB: 6dp)
- **Corners**: 12dp radius for cards, 8dp for chips, 24dp for FAB
- **Icons**: Material Icons (outlined style for consistency)
- **Spacing**: 8dp grid system (8dp, 16dp, 24dp, 32dp)
- **Ripple Effect**: All touchables use Material ripple with primary color at 12% opacity
- **FAB Shadow**: 
  - Elevation: 6dp
  - Color: #000000 at 20% opacity

## Assets to Generate

1. **icon.png** - App icon: Green circular gradient with minimalist SMS/money symbol | Used: Device home screen
2. **splash-icon.png** - Same as icon.png | Used: App launch
3. **empty-transactions.png** - Simple illustration of SMS messages transforming into transaction cards, muted green palette | Used: Transactions screen empty state
4. **empty-cards.png** - Outlined credit cards with plus symbol, light green accent | Used: Cards screen empty state
5. **setup-sms.png** - Phone with SMS bubbles, permission dialog style | Used: Settings SMS permission explanation
6. **sync-success.png** - Calendar with green checkmark | Used: Calendar sync confirmation toast

**Implementation Notes**:
- Request SMS read permissions on first launch with clear explanation
- Use Android WorkManager for periodic SMS scanning
- Implement Google Calendar API integration for promotion syncing
- Store parsed data locally (Room database)
- All financial amounts: 2 decimal precision, comma separators