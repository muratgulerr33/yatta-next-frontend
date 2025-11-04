// Node 20 — Renk Envanteri Tarayıcısı

// Çıktılar: reports/colors-in-use.csv ve reports/colors-in-use.md

import fs from 'fs';

import path from 'path';

const ROOT = process.cwd();

const SEARCH_DIRS = ['app','components','styles','lib','public'];

const EXTENSIONS = ['.tsx','.ts','.jsx','.js','.css','.scss','.mdx','.html'];

const reHex     = /#([0-9A-Fa-f]{3,8})\b/g;

const reRgb     = /\brgb\s*\(/g;

const reHsl     = /\bhsl\s*\(/g;

const reTwText  = /\btext-([a-zA-Z]+)-(?:[0-9]{2,3})\b/g;

const reTwBg    = /\bbg-([a-zA-Z]+)-(?:[0-9]{2,3})\b/g;

const reTwBorder= /\bborder-([a-zA-Z]+)-(?:[0-9]{2,3})\b/g;

const reTwGrad  = /\b(from|via|to)-([a-zA-Z]+)-(?:[0-9]{2,3})\b/g;

function* walk(dir){

  const entries = fs.readdirSync(dir,{withFileTypes:true});

  for(const e of entries){

    const p = path.join(dir,e.name);

    if(e.isDirectory()){

      if(/node_modules|\.next|\.git/.test(p)) continue;

      yield* walk(p);

    }else{

      if(EXTENSIONS.includes(path.extname(e.name))) yield p;

    }

  }

}

function getComponentName(fp){ return path.basename(fp, path.extname(fp)); }

function pushMatches(acc, fp, content, regex, ctx){

  content.replace(regex,(match)=>{

    const idx = content.indexOf(match);

    const line = content.slice(0,idx).split(/\r?\n/).length;

    acc.push({file:fp,line,value:match,context:ctx,component:getComponentName(fp)});

    return match;

  });

}

function analyzeFile(fp){

  const content = fs.readFileSync(fp,'utf8');

  const rows=[];

  pushMatches(rows,fp,content,reHex,'inline-hex');

  pushMatches(rows,fp,content,reRgb,'inline-rgb');

  pushMatches(rows,fp,content,reHsl,'inline-hsl');

  pushMatches(rows,fp,content,reTwText,'tw-text');

  pushMatches(rows,fp,content,reTwBg,'tw-bg');

  pushMatches(rows,fp,content,reTwBorder,'tw-border');

  pushMatches(rows,fp,content,reTwGrad,'tw-gradient');

  return rows;

}

function writeCSV(rows,out){

  const header='file,line,value,context,component\n';

  const body=rows.map(r=>[r.file,r.line,r.value,r.context,r.component]

    .map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\n');

  fs.writeFileSync(out,header+body,'utf8');

}

function writeMD(rows,out){

  const lines=[];

  lines.push('# Renk Envanteri — colors-in-use.md','');

  lines.push('Toplam kayıt: '+rows.length,'');

  lines.push('| # | Dosya | Satır | Değer | Bağlam | Bileşen |');

  lines.push('|---|-------|------:|-------|--------|---------|');

  rows.slice(0,5000).forEach((r,i)=>{

    lines.push(`| ${i+1} | ${r.file} | ${r.line} | \`${r.value}\` | ${r.context} | ${r.component} |`);

  });

  const counts=new Map();

  for(const r of rows){ counts.set(r.value,(counts.get(r.value)||0)+1); }

  const top20=[...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,20);

  lines.push('\n## En çok kullanılan ilk 20 renk','','| Renk | Kullanım |','|------|---------:|');

  for(const [k,v] of top20){ lines.push(`| \`${k}\` | ${v} |`); }

  fs.writeFileSync(out,lines.join('\n'),'utf8');

}

function main(){

  const results=[];

  for(const d of SEARCH_DIRS){

    const abs=path.join(ROOT,d);

    if(!fs.existsSync(abs)) continue;

    for(const fp of walk(abs)){

      try{ results.push(...analyzeFile(fp)); }catch{}

    }

  }

  fs.mkdirSync(path.join(ROOT,'reports'),{recursive:true});

  writeCSV(results, path.join(ROOT,'reports','colors-in-use.csv'));

  writeMD(results, path.join(ROOT,'reports','colors-in-use.md'));

  const counts=new Map();

  for(const r of results){ counts.set(r.value,(counts.get(r.value)||0)+1); }

  const top20=[...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,20);

  console.log('\n\x1b[36mEn çok kullanılan ilk 20 renk:\x1b[0m');

  for(const [k,v] of top20) console.log(String(v).padStart(4,' '), k);

  console.log('\nRaporlar: reports/colors-in-use.csv, reports/colors-in-use.md');

}

main();

