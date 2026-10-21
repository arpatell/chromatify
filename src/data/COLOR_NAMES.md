# Abstract color-name catalog

Source: Color.pizza https://api.color.pizza/v1/ and https://github.com/meodai/color-names (MIT), retrieved 2026-10-21.

The full provider catalog is filtered using the explicit non-food vocabulary in abstractColorVocabulary.json. No session colors are hardcoded. When an API result falls outside that vocabulary, or the provider is unavailable, choose the nearest catalog color in CIELAB space; keep the original displayed hex. The vocabulary is intentionally conservative so unknown food names cannot slip through a denylist. This file records data provenance; it is not an independent naming provider.
