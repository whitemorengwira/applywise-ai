// =============================================================================
// ApplyWise AI — Remote Supabase pgvector & Candidate Data Seeder
// Synchronizes Whitemore Ngwira's verified candidate profile and RAG chunks
// =============================================================================

const supabaseUrl = 'https://vxiufajiipqdntsxmkjn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aXVmYWppaXBxZG50c3hta2puIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTU1NTkyOSwiZXhwIjoyMTA1MTMxOTI5fQ.ZWB3IEOTLlmQaqn6b2_2-HhuvQ_n4Ku3tUnwpmJhJwk';

const headers = {
  'apikey': supabaseServiceKey,
  'Authorization': `Bearer ${supabaseServiceKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates,return=representation'
};

async function api(path, options = {}) {
  const url = `${supabaseUrl}/rest/v1/${path}`;
  const res = await fetch(url, {
    headers: { ...headers, ...options.headers },
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error [${res.status} ${res.statusText}] at ${path}: ${text}`);
  }
  return res.json();
}

async function seed() {
  console.log('🚀 Starting remote Supabase database synchronization...');

  // 1. Create or retrieve primary user
  console.log('1. Ensuring user record exists in "users"...');
  let user;
  const existingUsers = await api('users?email=eq.whitemore@nwhite.systems');
  if (existingUsers && existingUsers.length > 0) {
    user = existingUsers[0];
    console.log(`   Found existing user ID: ${user.id}`);
  } else {
    const createdUsers = await api('users', {
      method: 'POST',
      body: {
        email: 'whitemore@nwhite.systems',
        full_name: 'Whitemore Ngwira (N. White)',
        role: 'admin'
      }
    });
    user = createdUsers[0];
    console.log(`   Created user ID: ${user.id}`);
  }

  // 2. Ensure candidate profile exists
  console.log('2. Ensuring candidate profile in "candidate_profiles"...');
  let profile;
  const existingProfiles = await api(`candidate_profiles?user_id=eq.${user.id}`);
  if (existingProfiles && existingProfiles.length > 0) {
    profile = existingProfiles[0];
    console.log(`   Found candidate profile ID: ${profile.id}`);
  } else {
    const createdProfiles = await api('candidate_profiles', {
      method: 'POST',
      body: {
        user_id: user.id,
        headline: 'Principal Technology Architect & AI Systems Engineer',
        summary: 'Distinguished systems architect with 14+ years designing high-throughput cloud infrastructure, multi-engine databases, LiteLLM/Cloudflare AI gateways, and immutable audit trails across South Africa, UK, and Africa.',
        location: 'Johannesburg, South Africa / London, UK / Remote',
        remote_preference: 'Any',
        seniority_level: 'Principal',
        years_experience: 14,
        portfolio_url: 'https://nwhite.systems/',
        github_url: 'https://github.com/whitemorengwira',
        linkedin_url: 'https://linkedin.com/in/whitemore-ngwira'
      }
    });
    profile = createdProfiles[0];
    console.log(`   Created candidate profile ID: ${profile.id}`);
  }

  // 3. Ensure RAG document records exist
  console.log('3. Registering RAG documents in "rag_documents"...');
  let cvDoc, webDoc;
  const existingDocs = await api(`rag_documents?profile_id=eq.${profile.id}`);
  
  cvDoc = existingDocs.find(d => d.document_title === 'Whitemore Ngwira Master CV');
  if (!cvDoc) {
    const created = await api('rag_documents', {
      method: 'POST',
      body: {
        profile_id: profile.id,
        document_title: 'Whitemore Ngwira Master CV',
        source_type: 'cv_pdf',
        file_path: 'whitemore_ngwira_cv_n.white.pdf',
        total_chunks: 7
      }
    });
    cvDoc = created[0];
  }

  webDoc = existingDocs.find(d => d.document_title === 'N.White Systems Production Case Studies');
  if (!webDoc) {
    const created = await api('rag_documents', {
      method: 'POST',
      body: {
        profile_id: profile.id,
        document_title: 'N.White Systems Production Case Studies',
        source_type: 'portfolio',
        file_path: 'https://nwhite.systems/',
        total_chunks: 6
      }
    });
    webDoc = created[0];
  }
  console.log(`   RAG docs active: CV (${cvDoc.id}), Web (${webDoc.id})`);

  // 4. Populate RAG chunks
  console.log('4. Synchronizing RAG chunks in "rag_chunks"...');
  const existingChunks = await api(`rag_chunks?select=id`);
  console.log(`   Currently ${existingChunks.length} chunks in remote rag_chunks.`);

  if (existingChunks.length === 0) {
    const chunksToInsert = [
      {
        document_id: cvDoc.id,
        chunk_index: 0,
        chunk_text: 'Architected and integrated AI gateways with LiteLLM (multi-model routing, token cost tracking, Bedrock/Anthropic/OpenAI failover) and Cloudflare AI Gateway (edge caching across 300+ cities, rate limiting); operationalised human-supervised agentic workflows across forms, email, and CRM to reduce response times and protect margins.',
        metadata: { source: 'CV Section 1', title: 'AI Gateways & Agentic Automation Workflows', category: 'AI Systems' }
      },
      {
        document_id: cvDoc.id,
        chunk_index: 1,
        chunk_text: 'Delivered EarCodeX from prototype to production as an AWS cloud-native InsurTech platform; engineered claims administration, automated document intelligence, reconciliation services, immutable audit trails, and auditable human review, establishing robust privacy controls for regulated data.',
        metadata: { source: 'EarCodeX Blueprint', title: 'EarCodeX InsurTech Platform Architecture', category: 'Architecture' }
      },
      {
        document_id: cvDoc.id,
        chunk_index: 2,
        chunk_text: 'Engineered multi-tier AWS environments using Terraform (37 modular blueprints, S3 remote state, DynamoDB locking) and SAM; implemented Transit Gateway hybrid connectivity, Route53 DNS, S3 lifecycle policies, KMS envelope encryption, IAM least-privilege, and Tailscale zero-trust VPN, eliminating configuration drift and securing distributed access.',
        metadata: { source: 'Terraform Portfolio', title: 'Infrastructure as Code & Zero-Trust Blueprint', category: 'DevOps & Cloud' }
      },
      {
        document_id: cvDoc.id,
        chunk_index: 3,
        chunk_text: 'Architected multi-engine data tiers across Amazon DynamoDB, AWS RDS PostgreSQL (Multi-AZ), ElastiCache Redis, DocumentDB, Neptune, and Timestream; built serverless data lake pipelines via AWS Lake Formation, Glue, and Athena, enabling sub-second analytical queries across heterogeneous operational stores.',
        metadata: { source: 'Data Case Study', title: 'Multi-Engine Databases & Data Lakes', category: 'Architecture' }
      },
      {
        document_id: cvDoc.id,
        chunk_index: 4,
        chunk_text: 'Built and deployed live edtech platforms (Cineterns and Oasis College) from prototype to production using Next.js, TypeScript, Claude API, Supabase, and Tailwind; implemented multi-agent orchestration and learner workflows with human oversight to guarantee reliable, controlled educational delivery.',
        metadata: { source: 'EdTech Platform', title: 'EdTech Full-Stack AI Platforms', category: 'Full-Stack' }
      },
      {
        document_id: cvDoc.id,
        chunk_index: 5,
        chunk_text: 'Designed shaft-to-mill industrial telemetry and IoT sensor data architectures from extraction points to processing mills, engineering the technical foundation for the Socinga Smart Mining Platform to improve real-time operational visibility and executive decision-making.',
        metadata: { source: 'Mining Specs', title: 'Industrial Telemetry & Sensor Data Flows', category: 'Architecture' }
      },
      {
        document_id: cvDoc.id,
        chunk_index: 6,
        chunk_text: 'Architected high-throughput camera-to-cloud media pipelines, checksum-verified ingest, distributed post-production compute, and S3 Glacier archival preservation across 21 major productions (Netflix, MultiChoice Studios, SABC, 2010 FIFA World Cup), achieving automated quality control (QC) and playout compliance.',
        metadata: { source: 'Broadcast Case Study', title: 'High-Throughput Media & Playout Pipelines', category: 'Media' }
      },
      // Website chunks
      {
        document_id: webDoc.id,
        chunk_index: 7,
        chunk_text: 'Whitemore Ngwira designs the complete path around AI: business requirement, data and knowledge boundary, context, model, tools, state, retrieval, orchestration, tests, evals, security, deployment, monitoring, and human authority. Sourced from https://nwhite.systems/how-i-operate/ai-engineering.',
        metadata: { source: 'N.White Systems AI Philosophy', title: 'Senior AI Engineering & Production Architecture Philosophy', category: 'AI Systems' }
      },
      {
        document_id: webDoc.id,
        chunk_index: 8,
        chunk_text: 'NICO Life live insurance customer platform engineered around mobile performance, product clarity, and trust-sensitive customer journeys under strict regulatory compliance. Sourced from https://nwhite.systems/my-portfolio/nico-life.',
        metadata: { source: 'NICO Life Case Study', title: 'NICO Life — InsurTech Customer Platform', category: 'Architecture' }
      },
      {
        document_id: webDoc.id,
        chunk_index: 9,
        chunk_text: 'Supabets regulated high-traffic gaming platform with sub-second latency, transactional integrity, and statutory compliance. Sourced from https://nwhite.systems/my-portfolio/supabets.',
        metadata: { source: 'Supabets Case Study', title: 'Supabets — Regulated High-Traffic Gaming Platform', category: 'Architecture' }
      },
      {
        document_id: webDoc.id,
        chunk_index: 10,
        chunk_text: 'Socinga Africa Enterprise Platform & Smart Mining Hub (Mrs Jabulile Dladla, MD). Shaft-to-mill industrial telemetry and IoT sensor data architectures from extraction points to processing mills. Sourced from https://nwhite.systems/my-portfolio/socinga-africa.',
        metadata: { source: 'Socinga Case Study', title: 'Socinga Africa Enterprise Platform & Smart Mining Hub', category: 'Architecture' }
      },
      {
        document_id: webDoc.id,
        chunk_index: 11,
        chunk_text: 'SAMF archival preservation and digital media management pipeline with cryptographic checksum integrity (SHA-256) and automated cataloguing. Verified on GitHub: whitemorengwira/samf-documentary-production-workflow. Sourced from https://nwhite.systems/my-portfolio/multimedia.',
        metadata: { source: 'SAMF Case Study', title: 'SAMF Archival Preservation & High-Throughput Media Platform', category: 'Media' }
      },
      {
        document_id: webDoc.id,
        chunk_index: 12,
        chunk_text: 'EarCodeX InsurTech Platform (Mr Michael Dotsey, Executive Director). AWS cloud-native SaaS platform engineering claims administration, document intelligence, reconciliation services, and immutable audit trails. Live at https://earcodex.vercel.app/.',
        metadata: { source: 'EarCodeX Production', title: 'EarCodeX InsurTech Platform', category: 'Full-Stack' }
      }
    ];

    await api('rag_chunks', {
      method: 'POST',
      body: chunksToInsert
    });
    console.log(`   Successfully inserted ${chunksToInsert.length} RAG chunks into remote Supabase!`);
  }

  // 5. Seed Real Verified Job Listings
  console.log('5. Synchronizing verified job listings in "job_listings"...');
  const existingJobs = await api('job_listings?select=id');
  if (existingJobs.length === 0) {
    const jobsToInsert = [
      {
        title: 'AI Solutions Architect',
        company: 'IQbusiness',
        location: 'Johannesburg, South Africa',
        salary_min: 95000,
        salary_max: 130000,
        salary_currency: 'ZAR',
        remote_type: 'Hybrid',
        source_name: 'pnet',
        apply_url: 'https://iqbusiness.net/careers',
        extracted_skills: ['AWS', 'Bedrock', 'Generative AI', 'Agentic AI', 'Solution Architecture', 'Cloud Governance'],
        description: 'Leading design and delivery of enterprise-grade AI and Generative AI solutions across cloud platforms (AWS Bedrock / GCP Vertex AI). Requires 7-12+ years of experience in technology, data, or solution architecture with deep cloud and governance expertise.',
        is_active: true
      },
      {
        title: 'Applied and Agentic AI Solutions Lead',
        company: 'Enterprise Telecoms & Solutions Group',
        location: 'Roodepoort, Johannesburg, South Africa',
        salary_min: 100000,
        salary_max: 140000,
        salary_currency: 'ZAR',
        remote_type: 'Hybrid',
        source_name: 'pnet',
        apply_url: 'https://www.pnet.co.za',
        extracted_skills: ['Agentic AI', 'LangGraph', 'Python', 'AWS', 'Multi-Agent Systems', 'Distributed Architecture'],
        description: 'Architecting complex enterprise multi-agent workflows, model routing, and agentic AI systems for large-scale operations in South Africa.',
        is_active: true
      }
    ];

    await api('job_listings', {
      method: 'POST',
      body: jobsToInsert
    });
    console.log(`   Successfully inserted ${jobsToInsert.length} verified real job listings into remote Supabase!`);
  }

  console.log('\n✅ Remote Supabase database synchronization complete!');
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
