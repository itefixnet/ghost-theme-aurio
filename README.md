# Aurio Ghost Theme

A clean, minimal Ghost theme with archive filtering and search functionality.

## Features

- Clean single-column layout
- Archive dropdown in header for filtering posts by year
- Search functionality in header
- Fully responsive design
- Modern, minimal aesthetic
- Fast and lightweight

## Installation

1. **Download the theme files**
   ```bash
   cd /path/to/your/ghost/content/themes/
   git clone <your-repo-url> aurio
   # Or download and extract the ZIP file
   ```

2. **Restart Ghost**
   ```bash
   ghost restart
   ```

3. **Activate the theme**
   - Go to your Ghost admin panel: `https://notes.aurio.no/ghost`
   - Navigate to **Settings → Design**
   - Click **Change theme** and activate **Aurio**

## Theme Structure

```
aurio/
├── assets/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   └── js/
│       └── archive.js         # Archive dropdown & search functionality
├── partials/
│   ├── header.hbs            # Site header with archive & search
│   ├── sidebar.hbs           # Sidebar (for social links if configured)
│   └── footer.hbs            # Site footer
├── default.hbs               # Base template
├── index.hbs                 # Home page (post list)
├── post.hbs                  # Single post template
├── page.hbs                  # Static page template
└── package.json              # Theme configuration
```

## Customization

### Colors

Edit [assets/css/style.css](assets/css/style.css) to customize colors:

```css
/* Primary color */
a { color: #0066cc; }

/* Hover color */
a:hover { color: #004080; }

/* Background */
body { background-color: #f8f9fa; }
```

### Header

The [partials/header.hbs](partials/header.hbs) includes:
- Logo or site title
- Site title text next to logo
- Search box
- Archive dropdown
- Navigation menu

### Layout

The theme uses a centered single-column layout. Adjust the width in [assets/css/style.css](assets/css/style.css):

```css
.site-wrapper {
    max-width: 900px;
}
```

## Archive Feature

The header includes a dropdown that displays all posts grouped by year with post counts. The JavaScript automatically:
- Fetches published posts
- Groups them by year
- Displays years in dropdown with post counts
- Filters posts on the home page when a year is selected
- Updates URL with year parameter for direct linking

## Search Feature

The search box in the header provides real-time filtering of posts based on title and excerpt content.

## Requirements

- Ghost 5.0 or higher
- Modern web browser with JavaScript enabled

## Support

For issues or questions, please visit the [GitHub repository](https://github.com/yourusername/ghost-theme-aurio).

## Development

To work on this theme locally:

1. Clone the repository into your Ghost themes folder
2. Make your changes
3. Restart Ghost to see updates
4. For CSS/JS changes, clear your browser cache

## Credits

Developed for notes.aurio.no
