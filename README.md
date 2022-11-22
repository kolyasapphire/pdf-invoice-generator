# PDF Invoice Generator

## Intro

This small script is meant to be run monthly to generate a PDF invoice to get paid with.
You edit a config file once and touch it again only if your compensation values or bank account change.

Script automatically calculates invoice number (finds all previous invoices) and invoice date (25 of current month).

You'll find generated files neatly organised in the `output` directory. Good idea to back it up.

If you make a mistake, simply delete the generated file, change settings and run generation again.

## Set Up

1. Clone repo:

```bash
git clone https://github.com/kolyasapphire/pdf-invoice-generator
```

2. Install dependencies:

```bash
yarn
```

3. Copy config sample:

```bash
cp config.sample.json config.json
```

4. Edit `config.json` with your information.

## Generate

From the repo directory:

```bash
yarn generate
```

On macOS you can simply double-click `generate.command` in the repo folder.

## Update the Script

Do:

```bash
git pull
```
