export {};

// 声明全局 window 对象中的 Vue 属性，防止 TS 报错
declare global {
  interface Window {
      Vue: any;
  }
}

// 状态常量
const STATUS = {
  LAGGING: 0, // 落后 (红)
  PARITY: 1,  // 追齐 (黄)
  LEADING: 2, // 领先 (绿)
  STAR: 3     // 卓越 (紫/金)
};

// 获取 Vue 实例
const { createApp } = window.Vue;

createApp({
  data() {
      return {
          // Modal State
          modal: {
              show: false,
              mode: 'add', // 'add', 'edit', 'add-matrix', 'edit-matrix'
              text: '',
              targetQ: null,
              targetCat: null,
              targetIdx: null
          },

          // Roadmap Data Structure
          roadmapData: {
              q1: {
                  title: 'Q1 2026',
                  categories: {
                      ai: [
                          "诺娅 AI 产品规划设计",
                          "交互优化: AI 交互层面改造",
                          "概念发布: App 2.0 VIS 规范及高保真 Demo",
                          "场景试运行: 资产分析或资讯洞察",
                          "场景确定: 确定 3 个具体场景规划"
                      ],
                      exp: [
                          "开户流程简化 (SG/HK 缩减字段)",
                          "一键复购式入金 (Quick Deposit)"
                      ],
                      cap: [
                          "新加坡证券 (SG Launch): 开户/入金/行情/交易全链路",
                          "香港融资业务 (Margin): 港美股融资能力上线"
                      ]
                  }
              },
              q2: {
                  title: 'Q2 2026',
                  categories: {
                      ai: [
                          "核心详情页 AI 化 (异动/财报)",
                          "资产诊断 (Health Check)",
                          "资讯洞察: AI 舆情分析",
                          "一句话生成投资组合 (模拟/下单)",
                          "证券持仓诊断",
                          "诺娅 AI 人性化交互 (性格/昵称)"
                      ],
                      exp: [
                          "资产视图标准化 (7大分类)",
                          "货架清晰化 (重构导航/信息架构)",
                          "账户业务线上化 (PI/税务/解冻)",
                          "投资闭环优化 (公募/结构化/全委)"
                      ],
                      cap: [
                          "IPO 融资 (IPO Margin)",
                          "证券定投 (SIP)",
                          "全委 ETF 交易",
                          "债券产品上线",
                          "全购买力打通 (Phase 1: 现金+买港股)"
                      ]
                  }
              },
              q3: {
                  title: 'Q3 2026',
                  categories: {
                      ai: [
                          "协作引擎 (Nexus x App 联动)",
                          "存续服务自动化 (报告推送)",
                          "AI 理财师升级 (复杂咨询)",
                          "(深化) 核心详情页/资产诊断/资讯洞察"
                      ],
                      exp: [
                          "财富/资讯页改版: 观点即货架",
                          "体验可衡量 (PV/UV/Zero-result)",
                          "安卓应用商店上架 (HK/SG)"
                      ],
                      cap: [
                          "【增收】美股期权 (US Options)",
                          "Algo 交易 (均价算法单)",
                          "全购买力打通 (Phase 2: 证券打通财富)"
                      ]
                  }
              },
              q4: {
                  title: 'Q4 2026',
                  categories: {
                      ai: [
                          "交互减负: 一句话办理业务",
                          "智能辅助交易 (语音/语义下单)",
                          "客户任务 DIY (自定义盯盘)"
                      ],
                      exp: [
                          "投资全链路闭环优化 (私募/证券)",
                          "同一客户视图 (One ID)",
                          "资产页优化 (收益走势/归因)"
                      ],
                      cap: [
                          "多市场扩展 (日/台)(视业务情况)",
                          "数字货币 (Hashkey)(视业务情况)",
                          "全购买力打通 (Phase 3: 全品类/IPO)"
                      ]
                  }
              }
          },

          // Matrix Data Structure
          // 0: Red, 1: Yellow, 2: Green, 3: Star
          matrixData: [
              { name: "基础交易体验", q1: 0, q2: 1, q3: 2, q4: 2, benchmark: 2 },
              { name: "衍生品能力", q1: 0, q2: 1, q3: 2, q4: 2, benchmark: 2 },
              { name: "AI 交互体验", q1: 1, q2: 2, q3: 2, q4: 3, benchmark: 1 },
              { name: "账户与资金", q1: 1, q2: 2, q3: 2, q4: 2, benchmark: 2 }
          ]
      }
  },
  methods: {
      // Matrix Helpers
      getStatusClass(status: number) {
          switch(status) {
              case STATUS.LAGGING: return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300 border border-red-800";
              case STATUS.PARITY: return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300 border border-yellow-800";
              case STATUS.LEADING: return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/50 text-emerald-300 border border-emerald-800";
              case STATUS.STAR: return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-800 shadow-[0_0_10px_rgba(168,85,247,0.4)]";
              default: return "";
          }
      },
      getStatusLabel(status: number) {
          switch(status) {
              case STATUS.LAGGING: return "🔴 落后";
              case STATUS.PARITY: return "🟡 追齐";
              case STATUS.LEADING: return "🟢 领先";
              case STATUS.STAR: return "🌟 卓越";
              default: return "未知";
          }
      },
      cycleStatus(rowIdx: number, key: string) {
          // 0 -> 1 -> 2 -> 3 -> 0
          let current = (this.matrixData as any)[rowIdx][key];
          (this.matrixData as any)[rowIdx][key] = (current + 1) % 4;
      },

      // Modal & CRUD Helpers
      openModal(mode: string, qKey: string | null, catKey: string | null, idx: number | null = null) {
          this.modal.mode = mode;
          this.modal.targetQ = qKey;
          this.modal.targetCat = catKey;
          this.modal.targetIdx = idx;
          
          if (mode === 'edit' && idx !== null && qKey && catKey) {
              this.modal.text = (this.roadmapData as any)[qKey].categories[catKey][idx];
          } else if (mode === 'edit-matrix' && idx !== null) {
              this.modal.text = this.matrixData[idx].name;
          } else {
              this.modal.text = '';
          }
          this.modal.show = true;
      },
      closeModal() {
          this.modal.show = false;
          this.modal.text = '';
      },
      saveItem() {
          if (!this.modal.text.trim()) return;

          const { targetQ, targetCat, targetIdx, mode, text } = this.modal;
          
          if (mode === 'add' && targetQ && targetCat) {
              (this.roadmapData as any)[targetQ].categories[targetCat].push(text);
          } else if (mode === 'edit' && targetQ && targetCat && targetIdx !== null) {
              (this.roadmapData as any)[targetQ].categories[targetCat][targetIdx] = text;
          } else if (mode === 'add-matrix') {
              this.matrixData.push({
                  name: text,
                  q1: 0, q2: 0, q3: 0, q4: 0, benchmark: 0
              });
          } else if (mode === 'edit-matrix' && targetIdx !== null) {
              this.matrixData[targetIdx].name = text;
          }
          this.closeModal();
      },
      deleteItem() {
          if (!confirm('确定要删除此项目吗？')) return;
          
          const { targetQ, targetCat, targetIdx, mode } = this.modal;
          
          if (mode === 'edit' && targetQ && targetCat && targetIdx !== null) {
             (this.roadmapData as any)[targetQ].categories[targetCat].splice(targetIdx, 1);
          } else if (mode === 'edit-matrix' && targetIdx !== null) {
             this.matrixData.splice(targetIdx, 1);
          }
          this.closeModal();
      }
  }
}).mount('#app');