# jQuery Display Resolution
Modernized Helper for Web Designer

[Demo](https://adyoi.github.io/jquery-displayresolution/index.html)

## Fitur
- Menampilkan scroll position, width, dan height browser
- Klik untuk menyalin informasi CSS ke clipboard
- Fully configurable options
- Modern desain dengan responsif
- Ringan dan cepat

## Cara Menggunakan

### Via CDN (Recommended)

```html
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- Plugin CSS (opsional untuk styling) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">

<!-- Plugin JS -->
<script src="jquery.displayresolution.js"></script>
```

### Initialize

```javascript
$('#resolution').displayresolution({
    sep: ' | ',           // Pemisah antar nilai
    font: 'system-ui, sans-serif',  // Font family
    size: '14px',         // Ukuran font
    background: 'rgba(0,0,0,0.8)',  // Warna background
    color: '#fff',        // Warna teks
    width: 300,           // Lebar widget
    opacity: 0.8,         // Opacity
    top: 20,              // Jarak dari atas (pixel)
    right: 20,            // Jarak dari kanan (pixel)
    left: 'auto',         // Sisi kiri (auto/px)
    height: 'auto',       // Tinggi (auto/fixed pixel)
    borderRadius: 8,      // Sudut membulat
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',  // Bayangan
    transition: 'all 0.3s ease'  // Transisi efek
});
```

### Available Options

| Option | Default | Description |
|--------|---------|-------------|
| `sep` | `" | "` | Pemisah antar nilai |
| `font` | `"system-ui, sans-serif"` | Font family CSS |
| `size` | `"14px"` | Ukuran font |
| `background` | `"rgba(0,0,0,0.8)"` | Warna background |
| `color` | `"#fff"` | Warna teks |
| `width` | `300` | Lebar widget (px) |
| `opacity` | `0.8` | Opacity background |
| `height` | `"auto"` | Tinggi widget |
| `top` | `20` | Jarak dari atas (px) |
| `right` | `20` | Jarak dari kanan (px) |
| `left` | `"auto"` | Sisi kiri |
| `borderRadius` | `8` | Sudut membulat (px) |
| `boxShadow` | `"0 4px 12px rgba(0,0,0,0.15)"` | Bayangan |
| `transition` | `"all 0.3s ease"` | Transisi efek |

### Method Destroy

```javascript
// Destroy plugin instance
$('#resolution').displayresolution('destroy');
```

### Click to Copy

Klik pada widget untuk menyalin informasi CSS current ke clipboard. Widget akan menampilkan "Copied!" sebagai feedback visual.

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+
- Opera 67+

## License

MIT License - Copyright (c) 2026 Adi Apriyanto