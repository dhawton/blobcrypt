<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col md="6" class="my-1">
        <b-button
          v-if="showNew !== undefined"
          size="sm"
          variant="primary"
          @click="$router.push({ path: '/editor/new' })"
        >New Entry</b-button>
        <b-button
          style="margin-left: 1rem;"
          size="sm"
          variant="orange"
          @click="$router.push({ path: '/editor/new' })"
        >Refresh</b-button>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="2" label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search"/>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      show-empty
      stacked="md"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      empty-text="There are no entries available"
      @filtered="onFiltered"
      selectable
      select-mode="single"
      @row-selected="rowSelected"
    >
      <template slot="actions" v-if="showActions !== undefined" slot-scope="row">
        <b-button
          size="sm"
          variant="warning"
          @click="$router.push({ path: `/editor/${row.item.id}` })"
        >Edit</b-button>&nbsp;
        <b-button size="sm" variant="danger" @click="deleteEntry(row.item.id)">Delete</b-button>
      </template>
      <template slot="actions" slot-scope="row" v-if="showActions === undefined">
        <b-button
          size="sm"
          variant="primary"
          @click="$router.push({ path: `/entry/${username}/${row.item.id}` })"
        >View</b-button>
      </template>
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group label-cols-sm="2" label="Per page" class="mb-0" label-text-align="right">
          <b-form-select class="small-select" :options="pageOptions" v-model="perPage"/>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
        <b-pagination
          :total-rows="totalRows"
          :per-page="perPage"
          v-model="currentPage"
          class="my-0"
        />
      </b-col>
    </b-row>

    <b-modal
      id="deleteEntry"
      size="md"
      cancel-disabled
      title="Delete Entry"
      ref="deletemodal"
      ok-title="Yes"
      cancel-title="No"
      ok-variant="danger"
      cancel-variant="primary"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      lazy
      @ok="deleteEntryConfirm"
    >Are you sure you want to delete that entry?</b-modal>
    <b-modal
      id="processingModal"
      size="xl"
      title="Processing..."
      ok-only
      :busy="saving"
      :no-close-on-esc="saving"
      :no-close-on-backdrop="saving"
      :hide-header-close="saving"
      v-model="modalProcessingShow"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
    >
      <Spinner dark large style="text-align: center"/>
      <p style="text-align: center; margin-top: 1em;">
        <b>Processing request...</b>
      </p>
    </b-modal>
  </b-container>
</template>

<script>
import ajax from "../Api";

export default {
  name: "EntryTable",
  data() {
    return {
      fields: [
        {
          key: "id",
          label: "Entry ID",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "title",
          label: "Title",
          sortable: true
        },
        {
          key: "date",
          label: "Date Written",
          sortable: true,
          formatter: "dateFormatter"
        },
        { key: "actions", label: "Actions" }
      ],
      currentPage: 1,
      perPage: 50,
      pageOptions: [5, 10, 15, 25, 50, 100],
      sortBy: "id",
      sortDesc: false,
      sortDirection: "desc",
      selected: [],
      filter: null,
      modalInfo: { title: "", content: "" },
      processing: false,
      queuedDeleteId: undefined,
      modalProcessingShow: false,
      saving: false
    };
  },
  props: ["items", "username", "showNew", "showActions"],
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => ({ text: f.label, value: f.key }));
    },
    totalRows() {
      return this.items.length;
    }
  },
  methods: {
    dateFormatter(value) {
      const d = new Date(value);

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];

      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${
        d.getHours() < 10 ? "0" : ""
      }${d.getHours()}:${d.getMinutes() < 10 ? "0" : ""}${d.getMinutes()}`;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    rowSelected(row) {
      this.$router.push({ path: `/entry/${this.username}/${row[0].id}` });
    },
    deleteEntry(id) {
      this.queuedDeleteId = id;
      this.$refs.deletemodal.show();
    },
    deleteEntryConfirm() {
      this.modalProcessingShow = true;
      this.saving = true;
      ajax
        .post(`/entries`, {
          id: this.queuedDeleteId,
          delete: true
        })
        .then(() => {
          this.saving = false;
          this.modalProcessingShow = false;
          let blogs = this.$store.getters.blogs;
          blogs = blogs.filter(a => a.id !== this.queuedDeleteId);
          this.$store.commit("blogs", blogs);
          this.queuedDeleteId = undefined;
        })
        .catch(err => {
          console.error(err);
          this.$store.commit("error", err);
          this.$router.push({ path: "/error" });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.small-select {
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.375rem 0.375rem 0.375rem;
  width: 100px;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  vertical-align: middle;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

.btn-orange {
  background-color: #ff9900;
  color: #fff;
}
.btn-orange:hover {
  background-color: #dd6600;
}
</style>

