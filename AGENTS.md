This project is a WEB application based on React + NextJS.

Avoid repeat logic across componentes, hooks must be created when they can be reused in `src/hooks/` folder.
Avoid persist data in more than one place, use zustand to persist.

Use ZOD for validation.
Use react-hook-form for form handling.

Components with more than 200 lines must be splitted in smaller components.

Avoid useEffect, prefers declarative logics.

Common functions to parse, order, communicate externaly, should be in `lib` folder.

Any design change should follow the `src/styleguide.css`

Check `docs` folder for more informations.
