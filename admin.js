// ================================
// Admin Dashboard Logic
// ================================

// Check if user is logged in
let currentUser = null;

onAuthStateChanged((user) => {
  if (!user) {
    // Redirect to login if not authenticated
    window.location.href = 'login.html';
  } else {
    currentUser = user;
    document.getElementById('settingsEmail').textContent = user.email;
    document.getElementById('userEmail').textContent = user.email;
    initializeAdmin();
  }
});

// ================================
// Section Navigation
// ================================

const sidebarLinks = document.querySelectorAll('.sidebar-link');
const contentSections = document.querySelectorAll('.content-section');

sidebarLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const section = link.getAttribute('data-section');

    // Update active states
    sidebarLinks.forEach((l) => l.classList.remove('active'));
    contentSections.forEach((s) => s.classList.remove('active'));

    link.classList.add('active');
    document.querySelector(`.content-section[data-section="${section}"]`).classList.add('active');
  });
});

// ================================
// Logout
// ================================

document.getElementById('logoutBtn').addEventListener('click', async () => {
  if (confirm('Are you sure you want to logout?')) {
    try {
      await logoutUser();
      window.location.href = 'login.html';
    } catch (error) {
      alert('Logout failed: ' + error.message);
    }
  }
});

// ================================
// Initialize Admin
// ================================

async function initializeAdmin() {
  loadProjects();
  loadBlogPosts();
  loadCertifications();
  setupEventListeners();
}

// ================================
// Projects Management
// ================================

const addProjectBtn = document.getElementById('addProjectBtn');
const projectForm = document.getElementById('projectForm');
const projectFormEl = document.getElementById('projectFormEl');

addProjectBtn.addEventListener('click', () => {
  projectFormEl.reset();
  document.getElementById('projectId').value = '';
  document.getElementById('projectFormTitle').textContent = 'Add New Project';
  projectForm.style.display = 'flex';
});

projectFormEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  const projectId = document.getElementById('projectId').value;
  const title = document.getElementById('projectTitle').value;
  const description = document.getElementById('projectDesc').value;
  const tech = document.getElementById('projectTech').value;
  const link = document.getElementById('projectLink').value;

  const projectData = {
    title,
    description,
    technologies: tech.split(',').map((t) => t.trim()),
    link,
    createdAt: projectId ? undefined : firebase.database.ServerValue.TIMESTAMP
  };

  try {
    if (projectId) {
      await updateContent(`projects/${projectId}`, projectData);
    } else {
      const newRef = database.ref('projects').push();
      await newRef.set(projectData);
    }

    projectForm.style.display = 'none';
    loadProjects();
    showNotification('Project saved successfully!', 'success');
  } catch (error) {
    showNotification('Error saving project: ' + error.message, 'error');
  }
});

async function loadProjects() {
  try {
    const projects = await getContent('projects');
    const projectsList = document.getElementById('projectsList');

    if (!projects || Object.keys(projects).length === 0) {
      projectsList.innerHTML = '<p class="empty-state">No projects yet. Create your first project!</p>';
      document.getElementById('projectCount').textContent = '0';
      return;
    }

    document.getElementById('projectCount').textContent = Object.keys(projects).length;

    projectsList.innerHTML = Object.entries(projects)
      .map(
        ([id, project]) => `
      <div class="item-card">
        <div class="item-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem;">
            ${project.technologies.join(', ')}
          </p>
        </div>
        <div class="item-actions">
          <button class="button ghost" onclick="editProject('${id}')">Edit</button>
          <button class="button ghost" style="color: var(--red);" onclick="deleteProject('${id}')">Delete</button>
        </div>
      </div>
    `
      )
      .join('');
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

async function editProject(projectId) {
  try {
    const project = await getContent(`projects/${projectId}`);

    document.getElementById('projectId').value = projectId;
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectDesc').value = project.description;
    document.getElementById('projectTech').value = project.technologies.join(', ');
    document.getElementById('projectLink').value = project.link || '';
    document.getElementById('projectFormTitle').textContent = 'Edit Project';

    projectForm.style.display = 'flex';
  } catch (error) {
    showNotification('Error loading project: ' + error.message, 'error');
  }
}

async function deleteProject(projectId) {
  if (!confirm('Are you sure you want to delete this project?')) return;

  try {
    await deleteContent(`projects/${projectId}`);
    loadProjects();
    showNotification('Project deleted successfully!', 'success');
  } catch (error) {
    showNotification('Error deleting project: ' + error.message, 'error');
  }
}

// ================================
// Blog Posts Management
// ================================

const addBlogBtn = document.getElementById('addBlogBtn');
const blogForm = document.getElementById('blogForm');
const blogFormEl = document.getElementById('blogFormEl');

addBlogBtn.addEventListener('click', () => {
  blogFormEl.reset();
  document.getElementById('blogId').value = '';
  document.getElementById('blogFormTitle').textContent = 'Add New Blog Post';
  blogForm.style.display = 'flex';
});

blogFormEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  const blogId = document.getElementById('blogId').value;
  const title = document.getElementById('blogTitle').value;
  const category = document.getElementById('blogCategory').value;
  const content = document.getElementById('blogContent').value;
  const tags = document.getElementById('blogTags').value;

  const blogData = {
    title,
    category,
    content,
    tags: tags.split(',').map((t) => t.trim()),
    createdAt: blogId ? undefined : firebase.database.ServerValue.TIMESTAMP
  };

  try {
    if (blogId) {
      await updateContent(`blog/${blogId}`, blogData);
    } else {
      const newRef = database.ref('blog').push();
      await newRef.set(blogData);
    }

    blogForm.style.display = 'none';
    loadBlogPosts();
    showNotification('Blog post saved successfully!', 'success');
  } catch (error) {
    showNotification('Error saving blog post: ' + error.message, 'error');
  }
});

async function loadBlogPosts() {
  try {
    const posts = await getContent('blog');
    const blogList = document.getElementById('blogList');

    if (!posts || Object.keys(posts).length === 0) {
      blogList.innerHTML = '<p class="empty-state">No blog posts yet. Write your first post!</p>';
      document.getElementById('blogCount').textContent = '0';
      return;
    }

    document.getElementById('blogCount').textContent = Object.keys(posts).length;

    blogList.innerHTML = Object.entries(posts)
      .map(
        ([id, post]) => `
      <div class="item-card">
        <div class="item-info">
          <h3>${post.title}</h3>
          <p>${post.content.substring(0, 100)}...</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem;">
            Category: <strong>${post.category}</strong> | Tags: ${post.tags.join(', ')}
          </p>
        </div>
        <div class="item-actions">
          <button class="button ghost" onclick="editBlog('${id}')">Edit</button>
          <button class="button ghost" style="color: var(--red);" onclick="deleteBlog('${id}')">Delete</button>
        </div>
      </div>
    `
      )
      .join('');
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }
}

async function editBlog(blogId) {
  try {
    const post = await getContent(`blog/${blogId}`);

    document.getElementById('blogId').value = blogId;
    document.getElementById('blogTitle').value = post.title;
    document.getElementById('blogCategory').value = post.category;
    document.getElementById('blogContent').value = post.content;
    document.getElementById('blogTags').value = post.tags.join(', ');
    document.getElementById('blogFormTitle').textContent = 'Edit Blog Post';

    blogForm.style.display = 'flex';
  } catch (error) {
    showNotification('Error loading blog post: ' + error.message, 'error');
  }
}

async function deleteBlog(blogId) {
  if (!confirm('Are you sure you want to delete this blog post?')) return;

  try {
    await deleteContent(`blog/${blogId}`);
    loadBlogPosts();
    showNotification('Blog post deleted successfully!', 'success');
  } catch (error) {
    showNotification('Error deleting blog post: ' + error.message, 'error');
  }
}

// ================================
// Certifications Management
// ================================

const addCertBtn = document.getElementById('addCertBtn');
const certForm = document.getElementById('certForm');
const certFormEl = document.getElementById('certFormEl');

addCertBtn.addEventListener('click', () => {
  certFormEl.reset();
  document.getElementById('certId').value = '';
  document.getElementById('certFormTitle').textContent = 'Add Certification';
  certForm.style.display = 'flex';
});

certFormEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  const certId = document.getElementById('certId').value;
  const name = document.getElementById('certName').value;
  const issuer = document.getElementById('certIssuer').value;
  const date = document.getElementById('certDate').value;
  const link = document.getElementById('certLink').value;

  const certData = {
    name,
    issuer,
    dateEarned: date,
    credentialLink: link,
    createdAt: certId ? undefined : firebase.database.ServerValue.TIMESTAMP
  };

  try {
    if (certId) {
      await updateContent(`certifications/${certId}`, certData);
    } else {
      const newRef = database.ref('certifications').push();
      await newRef.set(certData);
    }

    certForm.style.display = 'none';
    loadCertifications();
    showNotification('Certification saved successfully!', 'success');
  } catch (error) {
    showNotification('Error saving certification: ' + error.message, 'error');
  }
});

async function loadCertifications() {
  try {
    const certs = await getContent('certifications');
    const certList = document.getElementById('certList');

    if (!certs || Object.keys(certs).length === 0) {
      certList.innerHTML = '<p class="empty-state">No certifications yet. Add your first one!</p>';
      document.getElementById('certCount').textContent = '0';
      return;
    }

    document.getElementById('certCount').textContent = Object.keys(certs).length;

    certList.innerHTML = Object.entries(certs)
      .map(
        ([id, cert]) => `
      <div class="item-card">
        <div class="item-info">
          <h3>${cert.name}</h3>
          <p>${cert.issuer}</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem;">
            Earned: ${new Date(cert.dateEarned).toLocaleDateString()}
          </p>
        </div>
        <div class="item-actions">
          <button class="button ghost" onclick="editCert('${id}')">Edit</button>
          <button class="button ghost" style="color: var(--red);" onclick="deleteCert('${id}')">Delete</button>
        </div>
      </div>
    `
      )
      .join('');
  } catch (error) {
    console.error('Error loading certifications:', error);
  }
}

async function editCert(certId) {
  try {
    const cert = await getContent(`certifications/${certId}`);

    document.getElementById('certId').value = certId;
    document.getElementById('certName').value = cert.name;
    document.getElementById('certIssuer').value = cert.issuer;
    document.getElementById('certDate').value = cert.dateEarned;
    document.getElementById('certLink').value = cert.credentialLink || '';
    document.getElementById('certFormTitle').textContent = 'Edit Certification';

    certForm.style.display = 'flex';
  } catch (error) {
    showNotification('Error loading certification: ' + error.message, 'error');
  }
}

async function deleteCert(certId) {
  if (!confirm('Are you sure you want to delete this certification?')) return;

  try {
    await deleteContent(`certifications/${certId}`);
    loadCertifications();
    showNotification('Certification deleted successfully!', 'success');
  } catch (error) {
    showNotification('Error deleting certification: ' + error.message, 'error');
  }
}

// ================================
// Settings
// ================================

document.getElementById('changePasswordBtn').addEventListener('click', () => {
  const newPassword = prompt('Enter new password (minimum 6 characters):');
  if (!newPassword) return;

  if (newPassword.length < 6) {
    showNotification('Password must be at least 6 characters', 'error');
    return;
  }

  currentUser
    .updatePassword(newPassword)
    .then(() => {
      showNotification('Password changed successfully!', 'success');
    })
    .catch((error) => {
      showNotification('Error changing password: ' + error.message, 'error');
    });
});

document.getElementById('deleteAccountBtn').addEventListener('click', () => {
  if (!confirm('WARNING: This will permanently delete your account and all associated data. Are you sure?')) {
    return;
  }

  if (!confirm('This action cannot be undone. Type "DELETE" to confirm.')) {
    return;
  }

  const confirmed = prompt('Type "DELETE" to confirm account deletion:');
  if (confirmed === 'DELETE') {
    currentUser
      .delete()
      .then(() => {
        alert('Account deleted successfully.');
        window.location.href = 'login.html';
      })
      .catch((error) => {
        showNotification('Error deleting account: ' + error.message, 'error');
      });
  } else {
    showNotification('Account deletion cancelled.', 'error');
  }
});

document.getElementById('exportBtn').addEventListener('click', async () => {
  try {
    const projects = await getContent('projects');
    const blog = await getContent('blog');
    const certifications = await getContent('certifications');

    const data = {
      exportedAt: new Date().toISOString(),
      projects: projects || {},
      blog: blog || {},
      certifications: certifications || {}
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `website-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showNotification('Data exported successfully!', 'success');
  } catch (error) {
    showNotification('Error exporting data: ' + error.message, 'error');
  }
});

// ================================
// Event Listeners Setup
// ================================

function setupEventListeners() {
  // Close modals when clicking the X button
  document.querySelectorAll('.modal-close, .modal-close-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      this.closest('.modal').style.display = 'none';
    });
  });

  // Close modals when clicking outside
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', function (e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
  });
}

// ================================
// Notifications
// ================================

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-sm);
    background: ${type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(248, 113, 113, 0.1)'};
    border: 1px solid ${type === 'success' ? 'var(--green)' : 'var(--red)'};
    color: ${type === 'success' ? 'var(--green)' : 'var(--red)'};
    font-weight: 500;
    animation: slideUp 0.3s ease-out;
    z-index: 10000;
    max-width: 400px;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
