# Agent Instructions and Coding Guidelines

## Core Principle: Code Should Be Self-Documenting

### 🚫 DO NOT ADD COMMENTS

**Primary Rule**: Do not add comments to code unless absolutely necessary.
Prefer self-documenting code, clear naming, and obvious structure over explanatory comments.

#### When Comments Are NOT Allowed:

- Explaining what the code does (should be obvious from names)
- Documenting simple logic or standard patterns
- JSX section comments for obvious structure
- Inline comments for CSS values or simple props
- Redundant explanations that duplicate the code

#### When Comments MAY Be Allowed (Rare Exceptions):

- **Business Logic**: Explaining non-obvious business rules
- **Complex Algorithms**: Documenting complex calculations or positioning logic
- **External Constraints**: Accessibility requirements, API limitations, design decisions
- **Cross-System Dependencies**: Explaining why certain systems interact in specific ways

### 📝 Code Style Guidelines

#### Naming Conventions

- Use descriptive function and variable names that explain purpose
- Prefer action-oriented names: `selectPlayerForPosition` vs `handlePlayerSelect`
- Use boolean prefixes: `isHovered`, `hasAssignments`, `canAssign`

#### Structure Over Comments

- Group related logic together
- Use clear component and function separation
- Let the code structure tell the story

#### JSX Guidelines

- Remove structural JSX comments unless clarifying complex conditional rendering
- Use semantic HTML and clear component props instead of comments
- Let component names and props provide documentation

### 🎯 Project-Specific Guidelines

#### Pickleball Game Logic

- Focus on clear state management and prop naming
- Use descriptive variable names for game state
- Let the game flow be obvious from the code structure

#### Design System Components

- Maintain the current minimal-comment approach
- Focus on clear prop interfaces and component composition
- Use TypeScript types as documentation

#### Accessibility & UX

- Document accessibility requirements only when non-obvious
- Let semantic HTML and ARIA labels provide self-documentation
- Use descriptive user-facing text instead of implementation comments

### ✅ Examples

#### ❌ Bad (With Comments):

```typescript
// Handle player selection
const handlePlayerSelect = (playerId: number) => {
  // Assign the player to the court
  assignPlayerToCourt(playerId);
};

{/* Player List */}
<Box>
  {players.map(player => (
    <div key={player.id}> {/* Player item */}</div>
  ))}
</Box>
```

#### ✅ Good (Self-Documenting):

```typescript
const selectPlayerForCourt = (playerId: number) => {
  assignPlayerToCourt(playerId);
};

<Box>
  {players.map(player => (
    <div key={player.id}></div>
  ))}
</Box>
```

### 🔧 Implementation Strategy

1. **Review Existing Code**: Remove unnecessary comments from current codebase
2. **Improve Naming**: Replace comments with better function/variable names
3. **Structure Refactoring**: Let code organization provide clarity
4. **TypeScript Documentation**: Use types and interfaces as documentation

### 📋 Current Codebase Improvements Needed

Based on analysis, focus on:

- Removing redundant explanatory comments in game logic
- Improving function names in pickleball components
- Eliminating JSX structural comments
- Replacing inline comments with better prop naming

---

**Remember**: The best comment is no comment. Write code that explains itself.
