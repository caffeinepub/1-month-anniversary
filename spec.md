# For My Love

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A single-page apology card app with floating hearts background animation
- Main card showing "I messed up..." message with a bouncing emoji
- "Yes, I forgive you" button that triggers confetti and shows success message
- "No" runaway button that moves away when hovered/touched (mobile optimized)
- Success card with "Yay! ❤️" message and "Surely Maan Jao Nehal Jii" special line
- Confetti canvas animation on acceptance
- Floating hearts background animation

### Modify
- None

### Remove
- None

## Implementation Plan
1. Create a simple React frontend that replicates the HTML/CSS/JS app exactly
2. Floating hearts background using useEffect to generate heart elements
3. Main card with apology message, yes/no buttons
4. Runaway "No" button logic on hover/touch
5. Success card revealed on "Yes" click
6. Confetti canvas animation using useRef and canvas API
7. Google Fonts (Fredoka One, Nunito) imported via index.css or link tag
8. No backend needed — purely frontend interactive experience
