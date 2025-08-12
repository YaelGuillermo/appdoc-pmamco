---
title: Book
description: Learn what a book is, how to create one, and which fields you need to complete.
---

# What is a Book?

A **Book** is a core product that materializes a program's purpose. It's the fundamental work unit within a program where specific contents are structured, organized, and developed. Books can be manuals, guides, technical documents, or any other type of educational or editorial material.

Books form the foundation of any program and allow breaking down large projects into manageable parts. Additionally, you can organize them hierarchically, as a book can contain sub-books (book divisions), making it easier to manage complex content.

![Overview](/images/en/projects/book/overview.webp)

---

## What is a Book used for?

- ✅ **Organizes content** into logical, manageable units
- ✅ **Defines the sequence** of project development
- ✅ **Assigns responsibilities** through team members
- ✅ **Facilitates progress tracking** for the team

---

## Book Fields

When creating or updating a book, you'll need to complete the following fields. Here we explain what each one means, which are mandatory, and which have available options.

![Create](/images/en/projects/book/create.webp)

### 📌 Mandatory fields

These fields **must always be completed** to save the book.

| Field | Description | Limit | Example |
|------|-------------|--------|-------|
| **Title** | Identifying name of the book. Should be clear and representative. | Maximum **64 characters** | `Book` |
| **Start date** | Day when book activities begin. | — | `January 15, 2025` |
| **End date** | Official ending day of the book. | — | `June 30, 2025` |
| **Program** | The program this book belongs to. *(Auto-filled)* | — | `Impact` |

> ⚠️ **Important**: If you don't complete these fields, you won't be able to save the book.

---

### 🔤 Optional (but recommended) fields

These fields aren't mandatory but help better structure your book.

| Field | Description | Limit | Example |
|------|-------------|--------|-------|
| **Description** | Explains the purpose, objectives or scope of the book. Helps others understand what it's about. | Maximum **512 characters** | `This book covers best practices for technical writing in professional documents.` |
| **Number** | Sequential number of the book within the program. Helps order books logically. | Between **1 and 15** | `3` |
| **Page count** | Approximate number of pages in the book. Useful for planning size and work duration. | Between **25 and 450** pages | `120` |
| **Parent book** | Optional. Allows hierarchical organization, creating sub-books under a main book. *(Auto-filled)* | — | `Book` |

---

## 📏 Important limits and rules

- 🔒 **Maximum 15 active books per program**  
  You can only have **15 active books** at a time within a program. If you need to create a new one, you'll have to archive a previous one.

- 📅 **Dates must make sense**  
  - The book must start **on or after** the start date of its **program** (if main) or **parent book** (if sub-book).
  - It must end **on or before** the end date of that same context.
  - Also, the **start date cannot be after the end date**. You can't create a book that ends before it starts.

- 🔄 **Progress is calculated automatically**  
  The system monitors book progress within the program. You can view it in the general report.

---

## 💡 Tips for creating a good book

- Use a **clear and specific title**, avoid generic names like "Document 1".
- Take advantage of the **description** to explain the book's purpose and scope.
- Define a **sequential number** that reflects logical order within the program.
- Assign an **owner** to ensure someone is responsible for development.
- Consider using **sub-books** if you need to divide content into smaller sections.

---

## 🚀 Actions

In the book interface, you'll find several quick actions available to efficiently manage your books. Here's what each one does:

![Actions](/images/en/projects/book/actions.webp)

| Action | What it does |
|--------|---------|
| **🗜️ Clone** | Creates a deep copy of the book and nested objects (sub-books, grades, sessions, etc.). Useful for replicating complex structures. |
| **📄 Duplicate** | Creates a shallow copy of the book (without internal content). Ideal as a template. |
| **✏️ Edit** | Allows modifying the book. |
| **👁️ View** | Shows book details: title, description, dates, number, etc. |
| **🖼️ Photo** | Displays the image or cover associated with the book. |
| **📦 Archive** | Temporarily removes the book. You can restore it when needed. |

---

## 📚 What's next after creating a book?

Once created, you can:
- Add **sub-books** and **grades** to the book
- Track the **book's progress** from the dashboard
- Mark the book as **favorite** for quick access

---

## 📝 Additional notes about recursion

A book can contain **sub-books** (book divisions), allowing hierarchical content organization. For example:

- **Main Book**: "Technical Writing Manual"
  - **Sub-Book 1**: "Chapter 1: Introduction to Technical Writing"
  - **Sub-Book 2**: "Chapter 2: Document Style and Structure"

This hierarchical structure helps manage large projects by breaking them into smaller, more manageable parts.

---

<!--
## 🔗 Recommended reading

- [What is a how-to guide?](https://diataxis.fr/how-to-guides/) – Learn how to structure practical and effective documentation.
-->